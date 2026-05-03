export type CloutEvent =
  | { type: 'PostCreated'; postId: string; creatorId: string; contentLength: number }
  | { type: 'LikeAdded'; postId: string; creatorId: string }
  | { type: 'LikeRemoved'; postId: string; creatorId: string }
  | { type: 'CommentAdded'; postId: string; creatorId: string }
  | { type: 'Repost'; postId: string; creatorId: string }
  | { type: 'BuyToken'; creatorId: string; usdAmount: number }
  | { type: 'SellToken'; creatorId: string; tokenAmount: number; usdEstimate: number }
  | { type: 'FollowUser'; creatorId: string }
  | { type: 'ReferralSignup'; referrerId: string };

export type CreatorPulse = {
  engagement: number;
  velocity: number;
  investmentUsd: number;
  buyerCount: number;
  followerGrowth: number;
  lastActivityAt: number;
};

export type EngineState = {
  cloutPoints: number;
  dayKey: string;
  dailyPointsEarned: number;
  actionStamps: Record<string, number[]>;
  lastTradeAt: number | null;
  tokenSpotPrice: number;
  platformFeesUsd: number;
  creatorAccruedUsd: Record<string, number>;
  pulse: Record<string, CreatorPulse>;
  postPulse: Record<string, { likes: number; comments: number; reposts: number; lastAt: number }>;
  eventCount: number;
};

export type DispatchFn = (e: CloutEvent) => void;
