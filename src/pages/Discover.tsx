import React from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CREATORS } from '../constants';

export const Discover: React.FC<{ onInvest: () => void; onProfile: () => void }> = ({ onInvest, onProfile }) => {
  return (
    <div className="px-4 pb-nav space-y-5 pt-3 max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
          <Search size={20} className="text-border-dark" strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="Search creators, tokens, or tags..." 
          className="w-full h-12 pl-11 pr-3 bg-white border-2 border-border-dark rounded-2xl text-sm font-bold hard-shadow transition-all focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none outline-none"
        />
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-2xl font-black">Hot Right Now</h2>
          <span className="text-[10px] font-black uppercase text-clout-yellow underline underline-offset-4 cursor-pointer">View All</span>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-5 px-5 select-none">
          {CREATORS.filter(c => c.id !== '3').map((creator, i) => (
            <BrutalistCard 
              key={creator.id} 
              variant={i % 2 === 0 ? 'purple' : 'green'} 
              className="flex-shrink-0 w-72 p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Avatar size="lg" src={creator.avatar} />
                <div>
                  <p className="font-bold text-slate-900 leading-tight">@{creator.handle}</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-sans">{creator.followers} Followers</p>
                </div>
              </div>
              <div className="bg-white/50 rounded-xl p-3 border-2 border-border-dark shadow-sm">
                <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Clout Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{creator.price}</span>
                  <span className="text-[10px] font-black text-clout-green">{creator.change}</span>
                </div>
              </div>
              <StickerButton onClick={onInvest} fullWidth className="h-10 text-[10px] font-bold">Invest Now</StickerButton>
            </BrutalistCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-2xl font-black">Exploding</h2>
        </div>
        <BrutalistCard onClick={onProfile} className="relative overflow-hidden p-0 hard-shadow cursor-pointer">
          <div className="h-40 w-full overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeIpvbHx8ZzHGshDLMokbVLJf675XS_KYmVp4SBc9pXHv2-YTPxGMkU-PQvwFPCavJ4fNheMMiqDLliijQIuadidYiXWgPRDYm-hMepG9jpDHfiKlAMvMZ06pryR76aAEp8nF3H3anqH3Aa5tSJFBHp8z7PJMBNjTOBrVFla9WGVhOOSJ2RUfdk_hOFoCmG8ISyVIBzWGKUeADddJAuvCXB8lvYGjy3xEWm_PrB6O2BioW7JOyZUAzJ9DZ5emuJ_TXoJzH42QxcmI" 
              alt="trending" 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
            />
            <div className="absolute top-4 left-4 bg-clout-yellow border-2 border-border-dark px-3 py-1 rounded-full text-[10px] font-black uppercase hard-shadow-sm">
              Top Gainer +240%
            </div>
          </div>
          <div className="p-5 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black leading-tight text-slate-900">CryptoPunk #4412</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase font-sans">Tokenized Asset</p>
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
            className="w-10 h-10 rounded-xl border-2 border-border-dark bg-white flex items-center justify-center hard-shadow-sm press-interaction text-slate-600"
          >
            <SlidersHorizontal size={20} aria-hidden />
          </button>
        </div>
        <div className="space-y-4">
          {CREATORS.map(creator => (
            <BrutalistCard key={creator.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 cursor-pointer" onClick={onProfile}>
                <Avatar size="lg" src={creator.avatar} />
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">@{creator.handle}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Joined 2h ago</p>
                </div>
              </div>
              <StickerButton onClick={onInvest} variant="secondary" className="h-10 px-4 text-[10px] font-black">Buy 0.1 ETH</StickerButton>
            </BrutalistCard>
          ))}
        </div>
      </section>
    </div>
  );
};
