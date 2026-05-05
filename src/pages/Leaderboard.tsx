import React, { useMemo, useState } from 'react';
import { BrutalistCard, Avatar } from '../components/UI';
import { CREATORS } from '../constants';
import { Flame, Sparkles, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { trendingScore } from '../engine/trending';
import type { CreatorPulse } from '../engine/types';

type LeaderboardTab = 'Hot shares' | 'New users' | 'P/L';

const zeroPulse = (now: number): CreatorPulse => ({
  engagement: 20,
  velocity: 1,
  investmentUsd: 200,
  buyerCount: 1,
  followerGrowth: 0,
  lastActivityAt: now,
});

const NEW_USERS = [
  { id: 'new-1', name: 'Mira Cole', handle: 'mira_builds.clout', joined: 'Joined 8m ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0TYhsmOuYzqBwGwZZStE0G-K6yhyu9GaV9um8iKXBNCqP9n6h6RYN-M0_ITmvvCorIvyG-JZVuvBH9b6wEXozMctX3Oi9QtjsXZLP87Yagkh0_MN7HfJ2WmVOYJiGrKEwSP8pY2HtOVWw8e5zyDYoZb9yaF7O9HBtba-zz11IaqAmsIpBDJ8eIBW-X2YX6GnLyDcwPmV4Du47fMyOI2u-FwTz7UvUUFj9IgB4ugKDDKLWAUQIyP-YP6FuoPgLcRyCyi_T8FCNKeY', move: '+18%', holders: 21 },
  { id: 'new-2', name: 'Nova Grant', handle: 'novagrant.clout', joined: 'Joined 24m ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyhuFPuWCBoM44_BQrAP-y1_OfSn8PFbdiwDFxsv-OlrfdEdyJFqhc659JNWFZywPuOW6ahzzB4dKN9OPmR3F9ubpHTJhGMlOM3bHNs11pQTzSVYZUEWgu4BWKEj3U0iZuLS2cW4R5fxpIn89B7_vCqMlj4cPf_72K036O-Ug8KY6f8HsPEE0obUzwQW2hcAi9yk8p4MexCL8WTdHmT4C8ArrWR8oznfi9KiRo023ldTsGaplyO2LXwgkKqUHT7hb6CDcHdgHEoTw', move: '+9%', holders: 13 },
  { id: 'new-3', name: 'Kade Wynn', handle: 'kadewynn.clout', joined: 'Joined 1h ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEsFkcH9NKiKD5L5H3K7IdjDSoW0eJ8_g3VCbFTTmZi9ZZPSkCoBaP_bznIwbp8dUcy1gNxDKyrBN2Eeuj6qYb_ZJ3hDK5crExbNndKMs7gDmrq-b0sNEuE9EC-niYOfkgOZ-etIqeHFR2qevdX31B1YkZS6ozNXFWnh0qJEe5KNeqXgILYI3Nfeuxt7uqDzf2a_VLjB5_fBgb1J3754uGp6Tn33NRSy-4HoUfy1qcVub1Qm793pRm1YXrf8w-UbbG8LmrehM9FSc', move: '-3%', holders: 8 },
];

const HOT_PL = [
  { id: '3', entry: '$31.60', now: '$42.85', pnl: '+35.6%', realized: '+$1,125' },
  { id: '1', entry: '$390.00', now: '$420.69', pnl: '+7.9%', realized: '+$614' },
  { id: '2', entry: '$202.40', now: '$185.20', pnl: '-8.5%', realized: '-$172' },
];

export const Leaderboard: React.FC<{ onProfileSelect: (creatorId: string) => void }> = ({ onProfileSelect }) => {
  const { state } = useCloutMarket();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('Hot shares');

  const hotShares = useMemo(() => {
    const t = Date.now();
    return [...CREATORS]
      .map((creator) => {
        const pulse = state.pulse[creator.id] ?? zeroPulse(t);
        return {
          creator,
          score: Math.round(trendingScore(pulse)),
          volume: pulse.investmentUsd,
          holders: Math.max(1, pulse.buyerCount),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [state.pulse]);

  const bestShare = hotShares[0];
  const bestPnl = HOT_PL[0];

  return (
    <div className="bg-clout-bg font-sans px-3 sm:px-4 pb-nav max-w-2xl mx-auto min-h-0 space-y-4 pt-2 sm:pt-3">
      <section className="space-y-1 px-1">
        <h1 className="text-3xl sm:text-4xl font-black leading-none tracking-tight">Leaderboard</h1>
        <p className="text-slate-600 font-bold text-xs uppercase tracking-widest opacity-70">Hot shares, fresh creators, and live P/L</p>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <BrutalistCard variant="white" className="p-3 min-h-[6rem] flex flex-col justify-between">
          <Flame size={18} className="text-orange-500" />
          <div>
            <p className="text-[8px] font-black uppercase text-slate-500">Hottest</p>
            <p className="text-sm font-black truncate">@{bestShare?.creator.handle}</p>
          </div>
        </BrutalistCard>
        <BrutalistCard variant="white" className="p-3 min-h-[6rem] flex flex-col justify-between">
          <Users size={18} className="text-border-dark" />
          <div>
            <p className="text-[8px] font-black uppercase text-slate-500">New users</p>
            <p className="text-sm font-black tabular-nums">{NEW_USERS.length}</p>
          </div>
        </BrutalistCard>
        <BrutalistCard variant="white" className="p-3 min-h-[6rem] flex flex-col justify-between">
          <TrendingUp size={18} className="text-clout-green" />
          <div>
            <p className="text-[8px] font-black uppercase text-slate-500">Best P/L</p>
            <p className="text-sm font-black text-clout-green">{bestPnl.pnl}</p>
          </div>
        </BrutalistCard>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 select-none scrollbar-hide" role="tablist" aria-label="Leaderboard views">
        {(['Hot shares', 'New users', 'P/L'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            className={cn(
              'shrink-0 whitespace-nowrap px-4 py-2 border rounded-full font-black text-[10px] uppercase transition-all press-interaction',
              activeTab === tab ? 'bg-border-dark text-white border-border-dark hard-shadow-sm' : 'bg-white text-slate-500 border-slate-200'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Hot shares' && (
        <section className="space-y-3">
          {hotShares.map((item, index) => {
            const changeDown = item.creator.change.startsWith('-');
            return (
              <BrutalistCard
                key={item.creator.id}
                onClick={() => onProfileSelect(item.creator.id)}
                className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center font-black text-xs hard-shadow-sm shrink-0">
                    {index + 1}
                  </div>
                  <Avatar size="md" src={item.creator.avatar} alt={item.creator.name} />
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate">@{item.creator.handle}</p>
                    <p className="text-[10px] font-bold opacity-60 uppercase truncate">${Math.round(item.volume).toLocaleString()} volume - {item.holders} holders</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-sm">{item.creator.price}</p>
                  <p className={cn('text-[10px] font-black flex justify-end items-center gap-0.5', changeDown ? 'text-red-500' : 'text-clout-green')}>
                    {changeDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {item.creator.change}
                  </p>
                </div>
              </BrutalistCard>
            );
          })}
        </section>
      )}

      {activeTab === 'New users' && (
        <section className="space-y-3">
          {NEW_USERS.map((user, index) => {
            const isPositive = !user.move.startsWith('-');
            return (
              <BrutalistCard key={user.id} variant="white" className="p-3 sm:p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center font-black text-xs hard-shadow-sm shrink-0">
                    {index + 1}
                  </div>
                  <Avatar size="md" src={user.avatar} alt={user.name} />
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate">@{user.handle}</p>
                    <p className="text-[10px] font-bold opacity-60 uppercase truncate">{user.joined} - {user.holders} holders</p>
                  </div>
                </div>
                <div className={cn('shrink-0 flex items-center gap-1 text-xs font-black', isPositive ? 'text-clout-green' : 'text-red-500')}>
                  <Sparkles size={14} /> {user.move}
                </div>
              </BrutalistCard>
            );
          })}
        </section>
      )}

      {activeTab === 'P/L' && (
        <section className="space-y-3">
          {HOT_PL.map((row, index) => {
            const creator = CREATORS.find((item) => item.id === row.id) ?? CREATORS[0];
            const isPositive = !row.pnl.startsWith('-');
            return (
              <BrutalistCard
                key={row.id}
                onClick={() => onProfileSelect(creator.id)}
                className="p-3 sm:p-4 bg-white space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center font-black text-xs hard-shadow-sm shrink-0">
                      {index + 1}
                    </div>
                    <Avatar size="md" src={creator.avatar} alt={creator.name} />
                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">@{creator.handle}</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase truncate">Entry {row.entry} - Now {row.now}</p>
                    </div>
                  </div>
                  <div className={cn('text-right shrink-0 font-black', isPositive ? 'text-clout-green' : 'text-red-500')}>
                    <p className="text-sm">{row.pnl}</p>
                    <p className="text-[10px]">{row.realized}</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full', isPositive ? 'bg-clout-green' : 'bg-red-500')}
                    style={{ width: isPositive ? '72%' : '32%' }}
                  />
                </div>
              </BrutalistCard>
            );
          })}
        </section>
      )}
    </div>
  );
};
