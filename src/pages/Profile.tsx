import React, { useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { CREATORS, POSTS } from '../constants';
import { ArrowLeft, TrendingUp, UserPlus, Heart, MessageCircle, Settings as SettingsIcon, Check, Repeat, Share2 } from 'lucide-react';
import { cn, copyTextToClipboard } from '../lib/utils';

const parseCount = (c: string): number => {
  if (c.endsWith('k')) return parseFloat(c) * 1000;
  if (c.endsWith('m')) return parseFloat(c) * 1000000;
  return parseInt(c, 10) || 0;
};

const formatCount = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'm';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return Math.round(n).toString();
};

export const Profile: React.FC<{ onBuy: () => void; onBack: () => void; onSettings: () => void; onSell: () => void }> = ({ onBuy, onBack, onSettings, onSell }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState<Record<string, { count: number, active: boolean }>>(
    Object.fromEntries(POSTS.map(p => [p.id, { count: parseCount(p.likes), active: false }]))
  );
  
  const creator = CREATORS[2]; // Alex Rivers

  const toggleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: {
        count: prev[id].active ? prev[id].count - 1 : prev[id].count + 1,
        active: !prev[id].active
      }
    }));
  };

  const shareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Check out ${creator.name} on CloutMarket`,
        url
      }).catch(() => {});
      return;
    }
    const ok = await copyTextToClipboard(url);
    alert(ok ? 'Link copied to clipboard.' : 'Copy not supported in this browser; share manually.');
  };

  return (
    <div className="bg-clout-pink pb-nav font-sans min-h-0">
      <header className="px-5 h-16 flex items-center justify-between border-b-2 border-border-dark bg-clout-bg">
        <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border-dark bg-white press-interaction hard-shadow-sm" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black italic text-xl">CloutMarket</span>
        <div className="flex gap-2">
          <button type="button" onClick={onSettings} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border-dark bg-white press-interaction hard-shadow-sm" aria-label="Settings">
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 max-w-2xl mx-auto space-y-4">
        <section className="flex flex-col items-center text-center space-y-2">
          <Avatar size="lg" src={creator.avatar} isVerified className="hard-shadow" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">{creator.name}</h1>
            <p className="text-slate-500 font-bold">@{creator.handle}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <BrutalistCard variant="purple" className="flex flex-col justify-between min-h-[6.5rem] p-3">
            <span className="text-[10px] font-black uppercase opacity-60">Price</span>
            <div>
              <span className="text-xl font-black">{creator.price}</span>
              <p className="text-[10px] font-bold text-clout-green flex items-center gap-1">
                <TrendingUp size={12} /> {creator.change}
              </p>
            </div>
          </BrutalistCard>
          
          <BrutalistCard variant="green" className="flex flex-col justify-between min-h-[6.5rem] p-3">
            <span className="text-[10px] font-black uppercase opacity-60">Holders</span>
            <div>
              <span className="text-xl font-black">1,248</span>
              <p className="text-[10px] font-bold opacity-60">Active Community</p>
            </div>
          </BrutalistCard>

          <BrutalistCard variant="yellow" className="flex flex-col justify-between min-h-[6.5rem] p-3 col-span-2 md:col-span-1">
            <span className="text-[10px] font-black uppercase opacity-60">Growth</span>
            <div>
              <div className="w-full h-2 bg-white border-2 border-border-dark rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-clout-green border-r border-border-dark"></div>
              </div>
              <p className="mt-2 text-[10px] font-bold opacity-70">75% Clout Score</p>
            </div>
          </BrutalistCard>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex gap-3">
            <StickerButton fullWidth onClick={onBuy} className="h-12 font-black text-sm">Buy</StickerButton>
            <StickerButton fullWidth onClick={onSell} variant="outline" className="h-12 font-black text-sm">Sell</StickerButton>
          </div>
          <div className="flex gap-3">
            <StickerButton 
              fullWidth 
              variant={isFollowing ? 'outline' : 'secondary'} 
              className="h-12 font-black text-sm" 
              onClick={() => setIsFollowing(!isFollowing)}
              leftIcon={isFollowing ? <Check size={20} /> : <UserPlus size={20} strokeWidth={3} />}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </StickerButton>
            <button 
              type="button"
              onClick={shareProfile}
              aria-label="Share profile"
              className="w-14 h-14 bg-white border-2 border-border-dark rounded-xl flex items-center justify-center hard-shadow-sm press-interaction shrink-0"
            >
              <Share2 size={24} />
            </button>
          </div>
        </section>

        <section className="pt-2">
          <div className="flex justify-between border-b-2 border-border-dark mb-4">
            <button type="button" className="flex-1 pb-3 border-b-4 border-border-dark font-black text-xs uppercase">Posts</button>
            <button type="button" onClick={() => alert('Holders list coming soon!')} className="flex-1 pb-3 border-b-4 border-transparent font-black text-xs uppercase opacity-30 px-2">Holders</button>
            <button type="button" onClick={() => alert('Stats coming soon!')} className="flex-1 pb-3 border-b-4 border-transparent font-black text-xs uppercase opacity-30 px-2">About</button>
          </div>

          <div className="space-y-3">
            {POSTS.filter(p => p.creatorId === '3').map(post => (
              <BrutalistCard key={post.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" src={post.creatorAvatar} />
                  <div>
                    <p className="font-bold text-sm tracking-tight">{post.creatorName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{post.timestamp}</p>
                  </div>
                </div>
                {post.image && (
                   <div className="rounded-lg border-2 border-border-dark overflow-hidden aspect-video hard-shadow-sm">
                     <img src={post.image} alt="content" className="w-full h-full object-cover" />
                   </div>
                )}
                <p className="text-sm font-medium leading-relaxed">{post.content}</p>
                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-black transition-colors press-interaction",
                      likes[post.id]?.active ? "text-red-500" : "text-slate-600"
                    )}
                  >
                    <Heart size={16} fill={likes[post.id]?.active ? "currentColor" : "none"} strokeWidth={3} /> {formatCount(likes[post.id]?.count ?? 0)}
                  </button>
                  <button type="button" onClick={() => alert('Comments coming soon!')} className="flex items-center gap-1 text-xs font-black text-slate-600 press-interaction">
                    <MessageCircle size={16} strokeWidth={3} /> {post.comments}
                  </button>
                  <button type="button" onClick={() => alert('Re-clouted!')} className="flex items-center gap-1 text-xs font-black text-slate-600 press-interaction">
                    <Repeat size={16} strokeWidth={3} />
                  </button>
                </div>
              </BrutalistCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
