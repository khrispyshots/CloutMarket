import { BONDING_CURVE_BASE_PRICE, BONDING_CURVE_SLOPE, MAX_SHARES_PER_CREATOR } from './config';

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function getSpotPrice(supply: number): number {
  const safeSupply = Math.max(0, supply);
  return BONDING_CURVE_BASE_PRICE + BONDING_CURVE_SLOPE * safeSupply;
}

export function getBuyCost(currentSupply: number, sharesOut: number): number {
  const supply = Math.max(0, currentSupply);
  const shares = Math.max(0, Math.min(sharesOut, MAX_SHARES_PER_CREATOR - supply));
  return roundMoney(BONDING_CURVE_BASE_PRICE * shares + BONDING_CURVE_SLOPE * (supply * shares + (shares * shares) / 2));
}

export function getSellReturn(currentSupply: number, sharesIn: number): number {
  const supply = Math.max(0, currentSupply);
  const shares = Math.max(0, Math.min(sharesIn, supply));
  return roundMoney(BONDING_CURVE_BASE_PRICE * shares + BONDING_CURVE_SLOPE * (supply * shares - (shares * shares) / 2));
}

export function getSharesForBuyAmount(currentSupply: number, spendableAmount: number): number {
  const supply = Math.max(0, currentSupply);
  const amount = Math.max(0, spendableAmount);
  const remainingSupply = Math.max(0, MAX_SHARES_PER_CREATOR - supply);
  const slope: number = BONDING_CURVE_SLOPE;

  if (amount <= 0 || remainingSupply <= 0) return 0;

  const a = slope / 2;
  const b = BONDING_CURVE_BASE_PRICE + slope * supply;
  const shares =
    slope === 0
      ? amount / BONDING_CURVE_BASE_PRICE
      : (-b + Math.sqrt(b * b + 4 * a * amount)) / (2 * a);

  return Math.min(remainingSupply, Math.max(0, shares));
}
