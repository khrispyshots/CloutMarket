/** Tunable economy — client-side simulation until backend exists */
export const FEE_BUY_PCT = 0.035; // 3.5% platform on buys
export const FEE_SELL_PCT = 0.025;
export const CREATOR_FEE_SHARE = 0.01; // 1% of buy to creator (display / accrual)

export const POINTS_POST = 12;
export const POINTS_LIKE_BASE = 2;
export const POINTS_LIKE_CREATOR = 3;
export const POINTS_COMMENT_BASE = 10;
export const POINTS_REPOST_BASE = 14;
export const POINTS_FOLLOW = 8;
export const POINTS_REFERRAL = 40;
export const POINTS_BUY_PER_USD = 0.35;
export const POINTS_SELL_MAX = 4;

export const DAILY_POINTS_CAP = 480;
export const TRADE_COOLDOWN_MS = 45_000;
export const DIMINISH_FACTOR = 0.82;
export const PRICE_BUY_IMPACT = 0.00012; // per USD on spot
export const PRICE_SELL_IMPACT = 0.00008;

export const STORAGE_KEY = 'cloutmarket-engine-v1';
