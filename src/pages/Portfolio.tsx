import React from 'react';
import { cn } from '../lib/utils';
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
  return (
    <div className="px-4 pb-nav space-y-5 pt-3 max-w-2xl mx-auto">
      <section className="bg-clout-green border-2 border-border-dark rounded-lg p-4 hard-shadow space-y-3">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Balance</p>
          <div className="bg-white px-2 py-1 border-2 border-on-surface rounded-full text-[10px] font-bold">
            +12.5% ↗
          </div>
        </div>
        <h1 className="text-3xl font-black">$42,850.24</h1>
        
        <div className="w-full h-24 bg-white/40 border-2 border-border-dark rounded-lg relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#175034" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#175034" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#175034" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black uppercase opacity-40">Last 7 Days Performance</span>
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
          <h2 className="text-xl font-black">Your Holdings</h2>
          <button type="button" onClick={onBuy} className="text-[10px] font-black uppercase text-clout-yellow underline underline-offset-4">View All</button>
        </div>

        <div className="space-y-3">
          {HOLDINGS.map((item) => (
            <BrutalistCard 
              key={item.id} 
              className={cn(
                'p-4 flex items-center gap-4 transition-transform active:scale-[0.99]',
                item.color === 'clout-green' ? 'bg-clout-green' : 
                item.color === 'clout-purple' ? 'bg-clout-purple' : 
                item.color === 'clout-yellow' ? 'bg-clout-yellow' : 'bg-white'
              )}
            >
              <div className="w-12 h-12 bg-white border-2 border-border-dark rounded-full flex items-center justify-center hard-shadow-sm">
                <Coins size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  <span className="font-black text-sm">{item.value}</span>
                </div>
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-[10px] font-black uppercase">{item.symbol}</span>
                  <span className="text-[10px] font-black uppercase">{item.amount}</span>
                </div>
              </div>
            </BrutalistCard>
          ))}
        </div>
      </section>

      <BrutalistCard variant="purple" className="p-5 space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="text-sm font-black uppercase tracking-tight">Portfolio Diversity</h3>
           <button type="button" onClick={onShowLeaderboard} className="text-[10px] font-black underline">Stats</button>
        </div>
        <div className="flex h-4 w-full border-2 border-border-dark rounded-full overflow-hidden bg-white">
          <div className="h-full bg-clout-yellow w-[45%] border-r-2 border-border-dark"></div>
          <div className="h-full bg-clout-green w-[30%] border-r-2 border-border-dark"></div>
          <div className="h-full bg-clout-purple w-[25%]"></div>
        </div>
        <div className="flex justify-between text-[8px] font-black uppercase">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-clout-yellow border border-border-dark"></div> ETH</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-clout-green border border-border-dark"></div> CLOUT</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-clout-purple border border-border-dark"></div> PASSES</div>
        </div>
      </BrutalistCard>
    </div>
  );
};

