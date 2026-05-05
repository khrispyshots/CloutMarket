import React, { useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { ArrowLeft, ShoppingCart, TrendingUp, CircleDollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { CREATOR_FEE_SHARE, FEE_BUY_PCT, TRADE_COOLDOWN_MS } from '../engine/config';
import { CREATORS } from '../constants';

export const BuyToken: React.FC<{ creatorId: string; onBack: () => void; onComplete: () => void }> = ({ creatorId, onBack, onComplete }) => {
   const { state, dispatch } = useCloutMarket();
   const [amount, setAmount] = useState('');
   const [asset, setAsset] = useState<'CELO' | 'cUSD'>('CELO');
   const creator = CREATORS.find((item) => item.id === creatorId) ?? CREATORS[2];

   const spot = state.tokenSpotPrice;
   const usd = parseFloat(amount);
   const usdValid = Number.isFinite(usd) && usd > 0;
   const shareAmount = usdValid ? (usd / spot).toFixed(4) : '0.00';
   const feeUsd = usdValid ? usd * FEE_BUY_PCT : 0;
   const creatorShare = usdValid ? usd * CREATOR_FEE_SHARE : 0;
   const inCooldown = state.lastTradeAt != null && Date.now() - state.lastTradeAt < TRADE_COOLDOWN_MS;

   return (
      <div className="h-full min-h-0 flex flex-col bg-clout-bg px-4 sm:px-5 w-full">
         <header className="shrink-0 h-14 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)]">
            <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Buy shares</h1>
         </header>

         <main className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-5 pb-6">
            <BrutalistCard variant="white" className="flex items-center gap-4 p-5">
               <Avatar size="lg" src={creator.avatar} isVerified={creator.isVerified} alt={creator.name} />
               <div>
                  <h2 className="text-xl font-black">@{creator.handle}</h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                     <TrendingUp size={12} strokeWidth={3} />
                     Bonding curve spot ${spot.toFixed(2)} / share
                  </div>
               </div>
            </BrutalistCard>

            <section className="text-center space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">You are buying</p>
               <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black tracking-tighter">{shareAmount}</span>
                  <span className="text-xl font-black text-slate-400">shares</span>
               </div>
            </section>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1 font-sans">Amount to invest ($)</label>
               <div className="relative">
                  <input
                     type="number"
                     inputMode="decimal"
                     min={0}
                     step="0.01"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="0.00"
                     className="w-full h-20 bg-white border border-slate-200 rounded-xl px-6 pr-24 text-2xl font-black outline-none focus:ring-2 focus:ring-border-dark/10 transition-colors hard-shadow-sm font-mono"
                  />
                  <button type="button" onClick={() => setAmount('100')} className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 px-4 py-2 border border-slate-200 rounded-full text-[10px] font-black uppercase hard-shadow-sm press-interaction">MAX</button>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1 font-sans">Pay With</label>
               <div className="grid grid-cols-2 gap-4">
                  <BrutalistCard
                     onClick={() => setAsset('CELO')}
                     className={cn(
                        "bg-white flex flex-col items-center gap-2 py-6 cursor-pointer border",
                        asset === 'CELO' ? "border-border-dark ring-2 ring-border-dark/10" : "border-slate-200 opacity-60"
                     )}
                  >
                     <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center hard-shadow-sm"><CircleDollarSign className="text-[#35D07F]" /></div>
                     <span className="text-xs font-black uppercase">CELO</span>
                     <span className="text-[9px] font-bold opacity-30">BAL: 124.50</span>
                  </BrutalistCard>
                  <BrutalistCard
                     onClick={() => setAsset('cUSD')}
                     variant="white"
                     className={cn(
                        "flex flex-col items-center gap-2 py-6 cursor-pointer border",
                        asset === 'cUSD' ? "border-border-dark ring-2 ring-border-dark/10" : "border-slate-200 opacity-60"
                     )}
                  >
                     <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center hard-shadow-sm"><CircleDollarSign className="text-[#45D0C5]" /></div>
                     <span className="text-xs font-black uppercase">cUSD</span>
                     <span className="text-[9px] font-bold opacity-30">BAL: 1,042.00</span>
                  </BrutalistCard>
               </div>
            </div>

            {inCooldown && usdValid && (
               <p className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Trade cooldown active. Clout rewards on this buy are reduced.
               </p>
            )}

            <BrutalistCard variant="surface" className="space-y-2 p-4 sm:p-5 bg-white">
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase gap-2">
                  <span className="tracking-wide shrink">Platform fee ({(FEE_BUY_PCT * 100).toFixed(1)}%)</span>
                  <span className="font-black text-border-dark tabular-nums">${feeUsd.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase gap-2">
                  <span className="tracking-wide shrink">Creator fee ({(CREATOR_FEE_SHARE * 100).toFixed(1)}%)</span>
                  <span className="font-black text-clout-green tabular-nums">${creatorShare.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase">
                  <span className="tracking-widest">Network</span>
                  <span className="font-black">~$0.002</span>
               </div>
               <div className="h-px bg-border-dark/10 my-1" />
               <div className="flex justify-between text-lg sm:text-xl font-black pt-0.5 gap-2">
                  <span>Notional</span>
                  <span className="tabular-nums">${usdValid ? usd.toFixed(2) : '0.00'}</span>
               </div>
            </BrutalistCard>
         </main>

         <div className="shrink-0 p-4 safe-bottom bg-clout-bg/95 backdrop-blur border-t border-slate-200">
            <StickerButton
               variant={usdValid ? "primary" : "outline"}
               fullWidth
               disabled={!usdValid}
               className="h-14 text-sm"
               onClick={
                  usdValid
                     ? () => {
                        dispatch({ type: 'BuyToken', creatorId: creator.id, usdAmount: usd });
                        onComplete();
                     }
                     : undefined
               }
               rightIcon={<ShoppingCart size={20} />}
            >
               {usdValid ? `Buy $${usd.toFixed(2)} of shares` : 'Enter amount'}
            </StickerButton>
         </div>
      </div>
   );
};
