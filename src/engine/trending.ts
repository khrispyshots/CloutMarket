import type { CreatorPulse } from './types';

/** Trending = (Engagement x Velocity) + Investment + FollowerGrowth (scaled) */
export function trendingScore(p: CreatorPulse): number {
  const engagement = p.engagement;
  const velocity = Math.max(0.2, p.velocity);
  const investment = Math.log10(10 + p.investmentUsd) * 40;
  const buyers = p.buyerCount * 6;
  const growth = p.followerGrowth * 14;
  return engagement * velocity + investment + buyers + growth;
}
