import React, { useMemo } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { Search, SlidersHorizontal, Flame } from 'lucide-react';
import { CREATORS } from '../constants';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { trendingScore } from '../engine/trending';
import type { CreatorPulse } from '../engine/types';

const zeroPulse = (now: number): CreatorPulse => ({
   engagement: 20,
   velocity: 1,
   investmentUsd: 200,
   buyerCount: 1,
   followerGrowth: 0,
   lastActivityAt: now,
});

export const Discover: React.FC<{ onInvest: () => void; onProfile: () => void }> = ({ onInvest, onProfile }) => {
   const { state } = useCloutMarket();

   const hotCreators = useMemo(() => {
      const t = Date.now();
      return [...CREATORS]
         .filter((c) => c.id !== '3')
         .sort(
            (a, b) =>
               trendingScore(state.pulse[b.id] ?? zeroPulse(t)) - trendingScore(state.pulse[a.id] ?? zeroPulse(t))
         );
   }, [state.pulse]);

   const newCreatorsRanked = useMemo(() => {
      const t = Date.now();
      return [...CREATORS].sort(
         (a, b) =>
            trendingScore(state.pulse[b.id] ?? zeroPulse(t)) - trendingScore(state.pulse[a.id] ?? zeroPulse(t))
      );
   }, [state.pulse]);

   return (
      <div className="px-3 sm:px-4 pb-nav space-y-4 sm:space-y-5 pt-2 sm:pt-3 w-full max-w-full">
         <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
               <Search size={20} className="text-border-dark" strokeWidth={3} />
            </div>
            <input
               type="text"
               placeholder="Search creators, shares, or tags..."
               className="w-full h-12 pl-11 pr-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold hard-shadow transition-all focus:shadow-none outline-none focus:ring-2 focus:ring-border-dark/10"
            />
         </div>

         <section className="space-y-4">
            <div className="flex justify-between items-end px-1 gap-2">
               <div>
                  <h2 className="text-xl sm:text-2xl font-black leading-tight">Hot Right Now</h2>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Trending = engagement x velocity + buys + growth</p>
               </div>
               <span className="text-[10px] font-black uppercase text-slate-700 underline underline-offset-4 cursor-pointer shrink-0">View All</span>
            </div>

            <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 -mx-3 px-3 sm:-mx-4 sm:px-4 select-none snap-x snap-mandatory">
               {hotCreators.map((creator, i) => (
                  <BrutalistCard
                     key={creator.id}
                     variant="white"
                     className="flex-shrink-0 snap-start w-[min(18rem,calc(100vw-2.75rem))] max-w-[18rem] p-4 sm:p-5 space-y-3 sm:space-y-4"
                  >
                     <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar size="lg" src={creator.avatar} />
                        <div className="min-w-0">
                           <p className="flex items-center gap-1 font-bold text-slate-900 leading-tight truncate">
                              <Flame size={14} className="shrink-0 text-orange-500" aria-hidden />
                              @{creator.handle}
                           </p>
                           <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-sans truncate">{creator.followers} Followers</p>
                        </div>
                     </div>
                     <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Share Price</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black">{creator.price}</span>
                           <span className="text-[10px] font-black text-clout-green">{creator.change}</span>
                        </div>
                     </div>
                     <StickerButton onClick={onInvest} fullWidth className="h-12 text-xs font-black uppercase tracking-tight shadow-lg">Buy shares</StickerButton>
                  </BrutalistCard>
               ))}
            </div>
         </section>

         <section className="space-y-4">
            <div className="flex justify-between items-end px-1">
               <h2 className="text-2xl font-black">Exploding</h2>
            </div>
            <BrutalistCard onClick={onProfile} className="relative overflow-hidden p-0 hard-shadow cursor-pointer">
               <div className="h-32 sm:h-40 w-full overflow-hidden">
                  <img
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeIpvbHx8ZzHGshDLMokbVLJf675XS_KYmVp4SBc9pXHv2-YTPxGMkU-PQvwFPCavJ4fNheMMiqDLliijQIuadidYiXWgPRDYm-hMepG9jpDHfiKlAMvMZ06pryR76aAEp8nF3H3anqH3Aa5tSJFBHp8z7PJMBNjTOBrVFla9WGVhOOSJ2RUfdk_hOFoCmG8ISyVIBzWGKUeADddJAuvCXB8lvYGjy3xEWm_PrB6O2BioW7JOyZUAzJ9DZ5emuJ_TXoJzH42QxcmI"
                     alt="trending"
                     className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black uppercase hard-shadow-sm">
                     Top Gainer +240%
                  </div>
               </div>
               <div className="p-5 flex justify-between items-center">
                  <div>
                     <h3 className="text-lg font-black leading-tight text-slate-900">CryptoPunk #4412</h3>
                     <p className="text-slate-500 text-[10px] font-bold uppercase font-sans">Tradable Asset</p>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-xl text-slate-900 leading-none">12.5 ETH</p>
                     <p className="text-[9px] font-black text-clout-green uppercase mt-1">HOT ASSET</p>
                  </div>
               </div>
            </BrutalistCard>
         </section>

         <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <h2 className="text-2xl font-black">New Creators</h2>
               <button
                  type="button"
                  aria-label="Filter new creators"
                  onClick={() => alert('Filters coming soon!')}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hard-shadow-sm press-interaction text-slate-600"
               >
                  <SlidersHorizontal size={20} aria-hidden />
               </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
               {newCreatorsRanked.map((creator) => (
                  <BrutalistCard key={creator.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                     <button type="button" className="flex items-center gap-3 cursor-pointer text-left min-w-0" onClick={onProfile}>
                        <Avatar size="lg" src={creator.avatar} />
                        <div className="min-w-0">
                           <h4 className="font-bold text-slate-900 leading-tight truncate">@{creator.handle}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">
                              Score {Math.round(trendingScore(state.pulse[creator.id] ?? zeroPulse(Date.now())))}
                           </p>
                        </div>
                     </button>
                     <StickerButton onClick={onInvest} variant="secondary" className="h-12 px-6 text-xs font-black shrink-0 w-full sm:w-auto shadow-md">Buy shares</StickerButton>
                  </BrutalistCard>
               ))}
            </div>
         </section>
      </div>
   );
};
