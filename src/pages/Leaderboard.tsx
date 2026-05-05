import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { ArrowLeft, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const RANKS = [
  { id: 1, handle: 'cryptoking.eth', amount: '42,890 shares', amountVal: 42890, change: '+15%', growthVal: 15, category: 'Dev', type: 'Share', color: 'bg-white', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJCXjj0jB0gSiNGYxnyg8Tc-Jq-CC7xowikRbkTQrPlWTIzivjjmj44T_XT3lz8ZzCJXllvQqTJcVNr4J3KsIlR05f4i7w43TsUBJ-Z7IiOxz37Env164MnOiP_Y1fThXy8N4Bhee3LorMMEO2FVMYIDKivDBFfz4WDXxgmufT-JE0vcV_Ny0CWI8SDGr0JJCxwUv3baV8sH_x1Y2KD97ErAywv5DrmHQzFJzowyDpqc-a61MoNYPrXTcQ8IP048puTySnbDD03GQ' },
  { id: 2, handle: 'solqueen.sol', amount: '38,120 shares', amountVal: 38120, change: '+12%', growthVal: 12, category: 'Artist', type: 'Pass', color: 'bg-white', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0TYhsmOuYzqBwGwZZStE0G-K6yhyu9GaV9um8iKXBNCqP9n6h6RYN-M0_ITmvvCorIvyG-JZVuvBH9b6wEXozMctX3Oi9QtjsXZLP87Yagkh0_MN7HfJ2WmVOYJiGrKEwSP8pY2HtOVWw8e5zyDYoZb9yaF7O9HBtba-zz11IaqAmsIpBDJ8eIBW-X2YX6GnLyDcwPmV4Du47fMyOI2u-FwTz7UvUUFj9IgB4ugKDDKLWAUQIyP-YP6FuoPgLcRyCyi_T8FCNKeY' },
  { id: 3, handle: 'dexter.base', amount: '35,400 shares', amountVal: 35400, change: '+5%', growthVal: 5, category: 'Founder', type: 'Asset', color: 'bg-white', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyhuFPuWCBoM44_BQrAP-y1_OfSn8PFbdiwDFxsv-OlrfdEdyJFqhc659JNWFZywPuOW6ahzzB4dKN9OPmR3F9ubpHTJhGMlOM3bHNs11pQTzSVYZUEWgu4BWKEj3U0iZuLS2cW4R5fxpIn89B7_vCqMlj4cPf_72K036O-Ug8KY6f8HsPEE0obUzwQW2hcAi9yk8p4MexCL8WTdHmT4C8ArrWR8oznfi9KiRo023ldTsGaplyO2LXwgkKqUHT7hb6CDcHdgHEoTw' },
  { id: 4, handle: 'nomad_life', amount: '31,050 shares', amountVal: 31050, change: '-2%', growthVal: -2, category: 'Founder', type: 'Share', color: 'bg-white', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEsFkcH9NKiKD5L5H3K7IdjDSoW0eJ8_g3VCbFTTmZi9ZZPSkCoBaP_bznIwbp8dUcy1gNxDKyrBN2Eeuj6qYb_ZJ3hDK5crExbNndKMs7gDmrq-b0sNEuE9EC-niYOfkgOZ-etIqeHFR2qevdX31B1YkZS6ozNXFWnh0qJEe5KNeqXgILYI3Nfeuxt7uqDzf2a_VLjB5_fBgb1J3754uGp6Tn33NRSy-4HoUfy1qcVub1Qm793pRm1YXrf8w-UbbG8LmrehM9FSc' },
  { id: 5, handle: 'alpha_chase', amount: '29,880 shares', amountVal: 29880, change: '+1%', growthVal: 1, category: 'Dev', type: 'Pass', color: 'bg-white', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRgbzsXEYINw5SRspMD9xKkJlgWRCLZzcr77NgbCVh0F3GYJa-Ndm8xMAFgTxDIx7yGQDTyZRfj8R67eBbI6Q2lgKbbXBZndA4sLBifkW44O7kdwClW9IJptFQuHWeQqPOvEAJaSWPvRnpx265YdUBJgd7dWXPKESB0hugcmhIW1fpgwojA6RnBCscFgpfkqIS72cIH8lbVX-5ggCnJX2eOK-ZLVVmE1tg1LT6oG4eYeX3kxLJzD5M_rxm6hbK72XtvyacOqZfxro' },
];

export const Leaderboard: React.FC<{ onBack: () => void; onProfileSelect: () => void }> = ({ onBack, onProfileSelect }) => {
  const [sortBy, setSortBy] = useState<'Value' | 'Growth' | 'Activity'>('Value');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRanks = useMemo(() => {
    let result = [...RANKS];
    
    if (filterCategory !== 'All') {
      result = result.filter(r => r.category === filterCategory);
    }
    
    if (filterType !== 'All') {
      result = result.filter(r => r.type === filterType);
    }

    result.sort((a, b) => {
      if (sortBy === 'Value') return b.amountVal - a.amountVal;
      if (sortBy === 'Growth') return b.growthVal - a.growthVal;
      return 0; // Default or activity (mocked)
    });

    return result;
  }, [sortBy, filterCategory, filterType]);

  return (
    <div className="bg-clout-bg font-sans px-4 pb-nav max-w-2xl mx-auto min-h-0">
       <header className="h-14 pt-3 flex items-center justify-between">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hard-shadow-sm press-interaction">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black italic text-xl">Leaderboard</span>
        <div className="w-10"></div>
      </header>

      <div className="mt-8 flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-4xl font-black leading-none">Leaderboard</h2>
          <p className="text-slate-600 font-bold text-xs uppercase tracking-widest opacity-60">Top performers</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white hard-shadow-sm press-interaction",
            showFilters && "bg-slate-100"
          )}
        >
          <Filter size={18} />
        </button>
      </div>

       <div className="flex gap-3 overflow-x-auto pb-4 mt-8 -mx-5 px-5 select-none scrollbar-hide">
        {(['Value', 'Growth', 'Activity'] as const).map(s => (
          <button 
            key={s}
            onClick={() => setSortBy(s)}
            className={cn(
              "whitespace-nowrap px-6 py-3 border rounded-full font-black text-xs uppercase transition-all press-interaction",
              sortBy === s ? "bg-border-dark text-white border-border-dark hard-shadow-sm" : "bg-white text-slate-400 border-slate-200"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4 hard-shadow-sm space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase opacity-60">Category</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Artist', 'Dev', 'Founder'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilterCategory(c)}
                      className={cn(
                        "px-3 py-1 border rounded-full text-[10px] font-black uppercase press-interaction",
                        filterCategory === c ? "bg-border-dark text-white border-border-dark" : "bg-white border-slate-200"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase opacity-60">Asset Type</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Share', 'Pass', 'Asset'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={cn(
                        "px-3 py-1 border rounded-full text-[10px] font-black uppercase press-interaction",
                        filterType === t ? "bg-border-dark text-white border-border-dark" : "bg-white border-slate-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredRanks.map((rank, i) => (
          <BrutalistCard 
            key={rank.handle} 
            onClick={onProfileSelect}
            className={cn('p-4 flex items-center justify-between cursor-pointer', rank.color)}
          >
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center font-black text-xs hard-shadow-sm">
                 {i + 1}
               </div>
               <Avatar size="md" src={rank.avatar} />
               <div>
                 <p className="font-black text-sm">@{rank.handle}</p>
                 <p className="text-[10px] font-bold opacity-60 uppercase">{rank.amount}{' - '}{rank.category}</p>
               </div>
             </div>
             <div className={cn(
               "flex items-center gap-1 font-black text-xs",
               rank.growthVal >= 0 ? "text-clout-green bg-emerald-50 px-1 rounded" : "text-red-500"
             )}>
                {rank.growthVal >= 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {Math.abs(rank.growthVal)}%
             </div>
          </BrutalistCard>
        ))}
      </div>

      <BrutalistCard className="mt-12 bg-white p-6 space-y-6">
        <h3 className="text-xl font-black">Your Clout Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <BrutalistCard variant="white" className="p-4 space-y-1">
            <span className="text-[8px] font-black uppercase opacity-60">Rank</span>
            <p className="text-2xl font-black">#452</p>
          </BrutalistCard>
          <BrutalistCard variant="white" className="p-4 space-y-1">
             <span className="text-[8px] font-black uppercase opacity-60">Percentile</span>
             <p className="text-2xl font-black italic">TOP 5%</p>
          </BrutalistCard>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-black text-[10px] uppercase">
            <span>Next Tier Progress</span>
            <span>75%</span>
          </div>
          <div className="h-6 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-clout-green rounded-full w-3/4"></div>
          </div>
        </div>
      </BrutalistCard>
    </div>
  );
};

