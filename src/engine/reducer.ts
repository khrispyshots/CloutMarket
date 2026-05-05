import {
  CREATOR_FEE_SHARE,
  INITIAL_OWNED_SHARES,
  DIMINISH_FACTOR,
  DAILY_POINTS_CAP,
  FEE_BUY_PCT,
  FEE_SELL_PCT,
  POINTS_BUY_PER_USD,
  POINTS_COMMENT_BASE,
  POINTS_FOLLOW,
  POINTS_LIKE_BASE,
  POINTS_LIKE_CREATOR,
  POINTS_POST,
  POINTS_REFERRAL,
  POINTS_REPOST_BASE,
  POINTS_SELL_MAX,
  PRICE_BUY_IMPACT,
  PRICE_SELL_IMPACT,
  TRADE_COOLDOWN_MS,
} from './config';
import type { CloutEvent, CreatorPulse, EngineState } from './types';

export function dayKeyFrom(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function ensureDay(state: EngineState, now: number): EngineState {
  const k = dayKeyFrom(now);
  if (state.dayKey === k) return state;
  return { ...state, dayKey: k, dailyPointsEarned: 0, actionStamps: {} };
}

function bumpPulse(
  pulse: Record<string, CreatorPulse>,
  creatorId: string,
  patch: Partial<CreatorPulse>,
  now: number
): Record<string, CreatorPulse> {
  const prev: CreatorPulse = pulse[creatorId] ?? {
    engagement: 0,
    velocity: 0,
    investmentUsd: 0,
    buyerCount: 0,
    followerGrowth: 0,
    lastActivityAt: now,
  };
  return {
    ...pulse,
    [creatorId]: {
      ...prev,
      ...patch,
      lastActivityAt: now,
    },
  };
}

function diminishingAward(state: EngineState, actionKey: string, base: number, now: number): number {
  const stamps = state.actionStamps[actionKey] ?? [];
  const windowStart = now - 86_400_000;
  const recent = stamps.filter((t) => t > windowStart);
  const n = recent.length;
  return base * Math.pow(DIMINISH_FACTOR, n);
}

function recordAction(state: EngineState, actionKey: string, now: number): EngineState {
  const stamps = [...(state.actionStamps[actionKey] ?? []), now].slice(-64);
  return { ...state, actionStamps: { ...state.actionStamps, [actionKey]: stamps } };
}

function awardPoints(state: EngineState, amount: number, now: number): EngineState {
  if (amount <= 0) return state;
  const room = Math.max(0, DAILY_POINTS_CAP - state.dailyPointsEarned);
  const applied = Math.min(amount, room);
  return {
    ...state,
    cloutPoints: state.cloutPoints + applied,
    dailyPointsEarned: state.dailyPointsEarned + applied,
  };
}

function trendingVelocity(prev: number, now: number): number {
  const dt = Math.max(1, now - prev);
  return 1000 / dt;
}

export function createInitialEngineState(): EngineState {
  const now = Date.now();
  const seed: Record<string, CreatorPulse> = {
    '1': { engagement: 120, velocity: 2, investmentUsd: 4200, buyerCount: 12, followerGrowth: 3, lastActivityAt: now },
    '2': { engagement: 95, velocity: 1.5, investmentUsd: 3100, buyerCount: 9, followerGrowth: 2, lastActivityAt: now },
    '3': { engagement: 200, velocity: 3.2, investmentUsd: 8800, buyerCount: 28, followerGrowth: 6, lastActivityAt: now },
  };
  return {
    cloutPoints: 4892,
    dayKey: dayKeyFrom(now),
    dailyPointsEarned: 0,
    actionStamps: {},
    lastTradeAt: null,
    tokenSpotPrice: 14.2,
    shareSupply: { me: INITIAL_OWNED_SHARES, '1': 842, '2': 611, '3': 1288 },
    shareHoldings: { me: INITIAL_OWNED_SHARES, '3': 1 },
    platformFeesUsd: 0,
    creatorAccruedUsd: {},
    pulse: seed,
    postPulse: {},
    eventCount: 0,
  };
}

export function reduceEngine(state: EngineState, event: CloutEvent, now = Date.now()): EngineState {
  let s = ensureDay({ ...state, eventCount: state.eventCount + 1 }, now);
  const dk = s.dayKey;

  switch (event.type) {
    case 'PostCreated': {
      const actionKey = `post:${dk}`;
      const pts = diminishingAward(s, actionKey, POINTS_POST, now);
      s = recordAction(s, actionKey, now);
      s = awardPoints(s, pts, now);
      s = {
        ...s,
        pulse: bumpPulse(s.pulse, event.creatorId, { engagement: (s.pulse[event.creatorId]?.engagement ?? 0) + 8, velocity: trendingVelocity(s.pulse[event.creatorId]?.lastActivityAt ?? now, now) }, now),
        postPulse: {
          ...s.postPulse,
          [event.postId]: { likes: 0, comments: 0, reposts: 0, lastAt: now },
        },
      };
      return s;
    }
    case 'LikeAdded': {
      const lk = `like:${event.postId}:${dk}`;
      const likerPts = diminishingAward(s, lk, POINTS_LIKE_BASE, now);
      const crPts = diminishingAward(s, `${lk}:c`, POINTS_LIKE_CREATOR, now);
      s = recordAction(s, lk, now);
      s = recordAction(s, `${lk}:c`, now);
      s = awardPoints(s, likerPts + crPts, now);
      const pm = s.postPulse[event.postId] ?? { likes: 0, comments: 0, reposts: 0, lastAt: now };
      s = {
        ...s,
        postPulse: { ...s.postPulse, [event.postId]: { ...pm, likes: pm.likes + 1, lastAt: now } },
        pulse: bumpPulse(s.pulse, event.creatorId, { engagement: (s.pulse[event.creatorId]?.engagement ?? 0) + 1 }, now),
      };
      return s;
    }
    case 'LikeRemoved': {
      const pm = s.postPulse[event.postId];
      if (!pm || pm.likes <= 0) return s;
      s = {
        ...s,
        postPulse: { ...s.postPulse, [event.postId]: { ...pm, likes: pm.likes - 1, lastAt: now } },
        pulse: bumpPulse(s.pulse, event.creatorId, { engagement: Math.max(0, (s.pulse[event.creatorId]?.engagement ?? 1) - 0.5) }, now),
      };
      return s;
    }
    case 'CommentAdded': {
      const ck = `cmt:${event.postId}:${dk}`;
      const pts = diminishingAward(s, ck, POINTS_COMMENT_BASE, now);
      s = recordAction(s, ck, now);
      s = awardPoints(s, pts, now);
      const pm = s.postPulse[event.postId] ?? { likes: 0, comments: 0, reposts: 0, lastAt: now };
      s = {
        ...s,
        postPulse: { ...s.postPulse, [event.postId]: { ...pm, comments: pm.comments + 1, lastAt: now } },
        pulse: bumpPulse(s.pulse, event.creatorId, { engagement: (s.pulse[event.creatorId]?.engagement ?? 0) + 4 }, now),
      };
      return s;
    }
    case 'Repost': {
      const rk = `rp:${event.postId}:${dk}`;
      const pts = diminishingAward(s, rk, POINTS_REPOST_BASE, now);
      s = recordAction(s, rk, now);
      s = awardPoints(s, pts, now);
      const pm = s.postPulse[event.postId] ?? { likes: 0, comments: 0, reposts: 0, lastAt: now };
      s = {
        ...s,
        postPulse: { ...s.postPulse, [event.postId]: { ...pm, reposts: pm.reposts + 1, lastAt: now } },
        pulse: bumpPulse(s.pulse, event.creatorId, { engagement: (s.pulse[event.creatorId]?.engagement ?? 0) + 6, velocity: (s.pulse[event.creatorId]?.velocity ?? 0) + 0.4 }, now),
      };
      return s;
    }
    case 'BuyToken': {
      const fee = event.usdAmount * FEE_BUY_PCT;
      const creatorCut = event.usdAmount * CREATOR_FEE_SHARE;
      const cooldownMul = s.lastTradeAt && now - s.lastTradeAt < TRADE_COOLDOWN_MS ? 0.35 : 1;
      const buyPts = Math.min(220, event.usdAmount * POINTS_BUY_PER_USD * cooldownMul);
      s = awardPoints(s, buyPts, now);
      const p = s.pulse[event.creatorId] ?? {
        engagement: 0,
        velocity: 0,
        investmentUsd: 0,
        buyerCount: 0,
        followerGrowth: 0,
        lastActivityAt: now,
      };
      s = {
        ...s,
        lastTradeAt: now,
        platformFeesUsd: s.platformFeesUsd + fee,
        shareSupply: { ...s.shareSupply, [event.creatorId]: (s.shareSupply[event.creatorId] ?? 1) + event.usdAmount / s.tokenSpotPrice },
        shareHoldings: { ...s.shareHoldings, [event.creatorId]: (s.shareHoldings[event.creatorId] ?? 0) + event.usdAmount / s.tokenSpotPrice },
        creatorAccruedUsd: { ...s.creatorAccruedUsd, [event.creatorId]: (s.creatorAccruedUsd[event.creatorId] ?? 0) + creatorCut },
        tokenSpotPrice: s.tokenSpotPrice + event.usdAmount * PRICE_BUY_IMPACT,
        pulse: bumpPulse(
          s.pulse,
          event.creatorId,
          {
            investmentUsd: p.investmentUsd + event.usdAmount,
            buyerCount: p.buyerCount + 1,
            velocity: p.velocity + 0.2,
            engagement: p.engagement + 3,
          },
          now
        ),
      };
      return s;
    }
    case 'SellToken': {
      const fee = event.usdEstimate * FEE_SELL_PCT;
      const pts = Math.min(POINTS_SELL_MAX, 1 + event.tokenAmount * 0.02);
      s = awardPoints(s, pts, now);
      const p = s.pulse[event.creatorId] ?? {
        engagement: 0,
        velocity: 0,
        investmentUsd: 0,
        buyerCount: 0,
        followerGrowth: 0,
        lastActivityAt: now,
      };
      s = {
        ...s,
        lastTradeAt: now,
        platformFeesUsd: s.platformFeesUsd + fee,
        shareSupply: { ...s.shareSupply, [event.creatorId]: Math.max(1, (s.shareSupply[event.creatorId] ?? 1) - event.tokenAmount) },
        shareHoldings: { ...s.shareHoldings, [event.creatorId]: Math.max(0, (s.shareHoldings[event.creatorId] ?? 0) - event.tokenAmount) },
        tokenSpotPrice: Math.max(0.5, s.tokenSpotPrice - event.usdEstimate * PRICE_SELL_IMPACT),
        pulse: bumpPulse(s.pulse, event.creatorId, { investmentUsd: Math.max(0, p.investmentUsd - event.usdEstimate * 0.3), velocity: Math.max(0.1, p.velocity - 0.05) }, now),
      };
      return s;
    }
    case 'FollowUser': {
      const fk = `fol:${event.creatorId}:${dk}`;
      const pts = diminishingAward(s, fk, POINTS_FOLLOW, now);
      s = recordAction(s, fk, now);
      s = awardPoints(s, pts, now);
      s = {
        ...s,
        pulse: bumpPulse(s.pulse, event.creatorId, { followerGrowth: (s.pulse[event.creatorId]?.followerGrowth ?? 0) + 1, engagement: (s.pulse[event.creatorId]?.engagement ?? 0) + 2 }, now),
      };
      return s;
    }
    case 'ReferralSignup': {
      const rk = `ref:${event.referrerId}:${dk}`;
      const pts = diminishingAward(s, rk, POINTS_REFERRAL, now);
      s = recordAction(s, rk, now);
      s = awardPoints(s, pts, now);
      return s;
    }
    default:
      return s;
  }
}
