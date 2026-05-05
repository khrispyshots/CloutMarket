import React from 'react';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { BrutalistCard, StickerButton } from '../components/UI';
import { HOLDINGS } from '../constants';
import { Plus, ArrowUpRight, Coins } from 'lucide-react';

const DATA = [
   { name: 'Mon', value: 30000 },
   { name: 'Tue', value: 35000 },
   { name: 'Wed', value: 32000 },
   { name: 'Thu', value: 40000 },
   { name: 'Fri', value: 38000 },
   { name: 'Sat', value: 42000 },
   { name: 'Sun', value: 42850 },
];

export const Portfolio: React.FC<{ onShowLeaderboard: () => void; onBuy: () => void; onWithdraw: () => void }> = ({ onShowLeaderboard, onBuy, onWithdraw }) => {
   const { state } = useCloutMarket();

   return (
      <div className="px-3 sm:px-4 pb-nav space-y-4 sm:space-y-5 pt-2 sm:pt-3 w-full max-w-full">
         <section className="bg-white border border-slate-200 rounded-lg p-4 hard-shadow space-y-3">
            <div className="flex justify-between items-start gap-3">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Holdings balance</p>
               <div className="bg-emerald-50 text-clout-green px-2 py-1 border border-emerald-100 rounded-full text-[10px] font-bold">
                  +12.5% up
               </div>
            </div>
            <div className="flex flex-col gap-1">
               <h1 className="text-2xl sm:text-3xl font-black tabular-nums">$42,850.24</h1>
               <p className="text-[10px] font-bold text-slate-600 leading-snug">
                  Event engine - ALEX spot <span className="font-black">${state.tokenSpotPrice.toFixed(2)}</span> - Platform fees{' '}
                  <span className="font-black">${state.platformFeesUsd.toFixed(2)}</span>
               </p>
            </div>

            <div className="w-full h-32 sm:h-40 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DATA}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#16A66A" stopOpacity={0.35} />
                           <stop offset="95%" stopColor="#16A66A" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#16A66A"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                     />
                  </AreaChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-slate-400">Last 7 days</span>
               </div>
            </div>
         </section>

         <div className="grid grid-cols-2 gap-3">
            <StickerButton onClick={onBuy} variant="primary" className="h-12 text-sm" leftIcon={<Plus size={18} strokeWidth={3} />}>
               Buy
            </StickerButton>
            <StickerButton onClick={onWithdraw} variant="outline" className="h-12 text-sm" leftIcon={<ArrowUpRight size={18} strokeWidth={3} />}>
               Withdraw
            </StickerButton>
         </div>

         <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <h2 className="text-xl font-black">My Holdings</h2>
               <button type="button" onClick={onBuy} className="text-[10px] font-black uppercase text-slate-700 underline underline-offset-4">Browse</button>
            </div>

            <div className="space-y-3">
               {HOLDINGS.map((item) => (
                  <BrutalistCard
                     key={item.id}
                     className="p-4 flex items-center gap-4 transition-transform active:scale-[0.99] bg-white"
                  >
                     <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center hard-shadow-sm">
                        <Coins size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-3">
                           <span className="font-bold text-sm tracking-tight truncate">{item.name}</span>
                           <span className="font-black text-sm shrink-0">{item.value}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-70 gap-3">
                           <span className="text-[10px] font-black uppercase">{item.symbol}</span>
                           <span className="text-[10px] font-black uppercase">{item.amount}</span>
                        </div>
                     </div>
                  </BrutalistCard>
               ))}
            </div>
         </section>

         <BrutalistCard variant="white" className="p-5 space-y-4">
            <div className="flex justify-between items-center">
               <h3 className="text-sm font-black uppercase tracking-tight">Holdings mix</h3>
               <button type="button" onClick={onShowLeaderboard} className="text-[10px] font-black underline">Stats</button>
            </div>
            <div className="flex h-4 w-full border border-slate-200 rounded-full overflow-hidden bg-white">
               <div className="h-full bg-border-dark w-[45%] border-r border-white"></div>
               <div className="h-full bg-clout-green w-[30%] border-r border-white"></div>
               <div className="h-full bg-slate-300 w-[25%]"></div>
            </div>
            <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-border-dark"></div> ETH</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-clout-green"></div> CLOUT</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div> PASSES</div>
            </div>
         </BrutalistCard>
      </div>
   );
};
