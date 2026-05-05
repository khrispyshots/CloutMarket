import React, { useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { ArrowLeft, TrendingDown, CircleDollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { FEE_SELL_PCT } from '../engine/config';
import { CREATORS } from '../constants';

export const SellToken: React.FC<{ creatorId: string; onBack: () => void; onComplete: () => void }> = ({ creatorId, onBack, onComplete }) => {
  const { state, dispatch } = useCloutMarket();
  const [shareAmount, setShareAmount] = useState('');
  const [asset, setAsset] = useState<'CELO' | 'cUSD'>('CELO');
  const creator = CREATORS.find((item) => item.id === creatorId) ?? CREATORS[2];

  const priceUsd = state.tokenSpotPrice;
  const shares = parseFloat(shareAmount);
  const sharesValid = Number.isFinite(shares) && shares > 0;
  const usdNum = sharesValid ? shares * priceUsd : 0;
  const usdEstimate = sharesValid ? usdNum.toFixed(2) : '0.00';
  const sellFee = usdNum * FEE_SELL_PCT;

  return (
    <div className="h-full min-h-0 flex flex-col bg-clout-bg px-4 sm:px-5 w-full">
      <header className="shrink-0 h-14 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)]">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Sell shares</h1>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto space-y-5 py-4 pb-6">
        <BrutalistCard variant="white" className="flex items-center gap-3 p-4">
          <Avatar size="lg" src={creator.avatar} isVerified={creator.isVerified} alt={creator.name} />
          <div>
            <h2 className="text-lg font-black">{creator.name}</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              <TrendingDown size={12} strokeWidth={3} />
              Bonding curve spot ${priceUsd.toFixed(2)} / share
            </div>
          </div>
        </BrutalistCard>

        <section className="text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">You receive (est.)</p>
          <p className="text-4xl font-black tracking-tighter">${usdEstimate}</p>
          <p className="text-xs font-bold text-slate-500">Holdings: {(state.shareHoldings[creator.id] ?? 1).toFixed(4)} shares</p>
        </section>

        <div className="space-y-2">
          <label htmlFor="sell-tokens" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Amount to sell (shares)</label>
          <div className="relative">
            <input
              id="sell-tokens"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.0001"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-16 bg-white border border-slate-200 rounded-xl px-4 pr-24 text-xl font-black outline-none focus:ring-2 focus:ring-border-dark/10 transition-colors hard-shadow-sm font-mono"
            />
            <button type="button" onClick={() => setShareAmount(((state.shareHoldings[creator.id] ?? 1) / 2).toFixed(4))} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 px-3 py-1.5 border border-slate-200 rounded-full text-[10px] font-black uppercase hard-shadow-sm press-interaction">
              HALF
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Receive as</p>
          <div className="grid grid-cols-2 gap-3">
            <BrutalistCard
              onClick={() => setAsset('CELO')}
              className={cn(
                'flex flex-col items-center gap-1.5 py-4 cursor-pointer border',
                asset === 'CELO' ? 'bg-white border-border-dark ring-2 ring-border-dark/10' : 'bg-white border-slate-200 opacity-70'
              )}
            >
              <CircleDollarSign className="text-[#35D07F]" size={22} />
              <span className="text-xs font-black uppercase">CELO</span>
            </BrutalistCard>
            <BrutalistCard
              onClick={() => setAsset('cUSD')}
              variant="white"
              className={cn(
                'flex flex-col items-center gap-1.5 py-4 cursor-pointer border',
                asset === 'cUSD' ? 'border-border-dark ring-2 ring-border-dark/10' : 'border-slate-200 opacity-70'
              )}
            >
              <CircleDollarSign className="text-[#45D0C5]" size={22} />
              <span className="text-xs font-black uppercase">cUSD</span>
            </BrutalistCard>
          </div>
        </div>

        <BrutalistCard variant="surface" className="p-4 bg-white space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
            <span>Est. fee ({(FEE_SELL_PCT * 100).toFixed(1)}%)</span>
            <span className="font-black text-border-dark">${sellFee.toFixed(2)}</span>
          </div>
        <p className="text-[10px] font-bold text-slate-500 leading-snug">Sells apply a small platform fee and reduced Clout rewards.</p>
        </BrutalistCard>
      </main>

      <div className="shrink-0 p-4 safe-bottom bg-clout-bg/95 backdrop-blur border-t border-slate-200">
        <StickerButton
          fullWidth
          variant={sharesValid ? 'primary' : 'outline'}
          disabled={!sharesValid}
          className="h-14 text-sm"
          onClick={
            sharesValid
              ? () => {
                dispatch({ type: 'SellToken', creatorId: creator.id, tokenAmount: shares, usdEstimate: usdNum });
                onComplete();
              }
              : undefined
          }
        >
          {sharesValid ? `Sell ${shares} shares` : 'Enter amount to sell'}
        </StickerButton>
      </div>
    </div>
  );
};
