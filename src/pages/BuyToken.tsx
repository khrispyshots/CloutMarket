import React, { useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { ArrowLeft, ShoppingCart, TrendingUp, CircleDollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { CREATOR_FEE_SHARE, FEE_BUY_PCT, TRADE_COOLDOWN_MS } from '../engine/config';

const CREATOR_ID = '3';

export const BuyToken: React.FC<{ onBack: () => void; onComplete: () => void }> = ({ onBack, onComplete }) => {
   const { state, dispatch } = useCloutMarket();
   const [amount, setAmount] = useState('');
   const [asset, setAsset] = useState<'CELO' | 'cUSD'>('CELO');

   const spot = state.tokenSpotPrice;
   const usd = parseFloat(amount);
   const usdValid = Number.isFinite(usd) && usd > 0;
   const tokenAmount = usdValid ? (usd / spot).toFixed(4) : '0.00';
   const feeUsd = usdValid ? usd * FEE_BUY_PCT : 0;
   const creatorShare = usdValid ? usd * CREATOR_FEE_SHARE : 0;
   const inCooldown = state.lastTradeAt != null && Date.now() - state.lastTradeAt < TRADE_COOLDOWN_MS;

   return (
      <div className="h-full min-h-0 flex flex-col bg-clout-bg px-4 sm:px-5 w-full">
         <header className="shrink-0 h-14 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)]">
            <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border-dark bg-white press-interaction hard-shadow-sm">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-black italic tracking-tighter">Buy Token</h1>
         </header>

         <main className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-6 pb-36">
            <BrutalistCard variant="purple" className="flex items-center gap-4 p-5">
               <Avatar size="lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAGAmwU4PxJuhxgzmB8cNdIKTqleuKvmnFM5XwvCGD9CyPpUgjBaremodzH0foGG8UZowwBKUtSPsJLmo8ZJILUe7vdKTC8s1ta4lnPL91YO5lllU7sTGJtyCSJx4a6wVQTgqlhpN-PVlIxtW60vCjdhugvoKDz2mI-oqQjc7aZIQN_K2-ia4BXtQlim_8C8wNEPZaPV6l0vCATpZbsBxukb7cXQBGYlSBxG98ZzfCkZtg9Ps_SE1Iiy6Bc7ScCCb3_gz4LJKYAaM" isVerified />
               <div>
                  <h2 className="text-xl font-black">@alex_creativ</h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                     <TrendingUp size={12} strokeWidth={3} />
                     Live spot ${spot.toFixed(2)} / ALEX
                  </div>
               </div>
            </BrutalistCard>

            <section className="text-center space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">You are buying</p>
               <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black tracking-tighter">{tokenAmount}</span>
                  <span className="text-xl font-black text-slate-400">ALEX</span>
               </div>
            </section>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1 font-sans">Amount to Invest ($)</label>
               <div className="relative">
                  <input
                     type="number"
                     inputMode="decimal"
                     min={0}
                     step="0.01"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="0.00"
                     className="w-full h-20 bg-white border-2 border-border-dark rounded-xl px-6 pr-24 text-2xl font-black outline-none focus:bg-clout-yellow transition-colors hard-shadow-sm font-mono"
                  />
                  <button type="button" onClick={() => setAmount('100')} className="absolute right-4 top-1/2 -translate-y-1/2 bg-clout-yellow px-4 py-2 border-2 border-border-dark rounded-full text-[10px] font-black uppercase hard-shadow-sm press-interaction">MAX</button>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-1 font-sans">Pay With</label>
               <div className="grid grid-cols-2 gap-4">
                  <BrutalistCard
                     onClick={() => setAsset('CELO')}
                     className={cn(
                        "bg-white flex flex-col items-center gap-2 py-6 cursor-pointer border-2",
                        asset === 'CELO' ? "bg-clout-yellow border-border-dark" : "border-border-dark opacity-60"
                     )}
                  >
                     <div className="w-12 h-12 bg-white rounded-full border-2 border-border-dark flex items-center justify-center hard-shadow-sm"><CircleDollarSign className="text-[#35D07F]" /></div>
                     <span className="text-xs font-black uppercase">CELO</span>
                     <span className="text-[9px] font-bold opacity-30">BAL: 124.50</span>
                  </BrutalistCard>
                  <BrutalistCard
                     onClick={() => setAsset('cUSD')}
                     variant="green"
                     className={cn(
                        "flex flex-col items-center gap-2 py-6 cursor-pointer border-2",
                        asset === 'cUSD' ? "border-border-dark" : "border-border-dark opacity-60"
                     )}
                  >
                     <div className="w-12 h-12 bg-white rounded-full border-2 border-border-dark flex items-center justify-center hard-shadow-sm"><CircleDollarSign className="text-[#45D0C5]" /></div>
                     <span className="text-xs font-black uppercase">cUSD</span>
                     <span className="text-[9px] font-bold opacity-30">BAL: 1,042.00</span>
                  </BrutalistCard>
               </div>
            </div>

            {inCooldown && usdValid && (
               <p className="text-[10px] font-bold text-amber-900 bg-amber-100 border-2 border-border-dark rounded-lg px-3 py-2">
                  Trade cooldown active — Clout rewards on this buy are reduced (anti-spam).
               </p>
            )}

            <BrutalistCard variant="surface" className="space-y-2 p-4 sm:p-5 bg-white">
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase gap-2">
                  <span className="tracking-wide shrink">Platform fee ({(FEE_BUY_PCT * 100).toFixed(1)}%)</span>
                  <span className="font-black text-border-dark tabular-nums">${feeUsd.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase gap-2">
                  <span className="tracking-wide shrink">Creator share ({(CREATOR_FEE_SHARE * 100).toFixed(1)}%)</span>
                  <span className="font-black text-clout-green tabular-nums">${creatorShare.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 font-sans uppercase">
                  <span className="tracking-widest">Network</span>
                  <span className="font-black">~$0.002</span>
               </div>
               <div className="h-px bg-border-dark/15 border-dashed border-t-2 my-1" />
               <div className="flex justify-between text-lg sm:text-xl font-black pt-0.5 gap-2">
                  <span>Notional</span>
                  <span className="tabular-nums">${usdValid ? usd.toFixed(2) : '0.00'}</span>
               </div>
            </BrutalistCard>
         </main>

         <div className="shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] bg-clout-bg/95 backdrop-blur border-t-2 border-border-dark/10">
            <StickerButton
               variant={usdValid ? "secondary" : "outline"}
               fullWidth
               disabled={!usdValid}
               onClick={
                  usdValid
                     ? () => {
                        dispatch({ type: 'BuyToken', creatorId: CREATOR_ID, usdAmount: usd });
                        onComplete();
                     }
                     : undefined
               }
               rightIcon={<ShoppingCart size={20} />}
            >
               {usdValid ? `Buy $${usd.toFixed(2)} worth of ALEX` : 'Enter amount'}
            </StickerButton>
         </div>
      </div>
   );
};
