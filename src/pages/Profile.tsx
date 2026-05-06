import React, { useMemo, useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { CREATORS, POSTS } from '../constants';
import type { Creator, CurrentUser, Post } from '../types';
import {
   ArrowLeft,
   Bell,
   BriefcaseBusiness,
   Check,
   Heart,
   MessageCircle,
   Repeat,
   Settings as SettingsIcon,
   Share2,
   TrendingUp,
   UserPlus,
} from 'lucide-react';
import { cn, copyTextToClipboard } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { getSpotPrice } from '../engine/bondingCurve';

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

const creatorFromUser = (user: CurrentUser): Creator => ({
   id: user.id,
   name: user.name,
   handle: user.cloutName,
   followers: user.followers,
   price: user.price,
   change: user.change,
   avatar: user.avatar,
   bio: user.bio,
   joinedAt: user.joinedAt,
   isVerified: user.isVerified,
});

export const Profile: React.FC<{
   currentUser: CurrentUser;
   selectedCreatorId: string;
   myPosts: Post[];
   onBuy: () => void;
   onBack: () => void;
   onSettings: () => void;
   onSell: () => void;
   onPortfolio: () => void;
   onNotifications: () => void;
}> = ({ currentUser, selectedCreatorId, myPosts, onBuy, onBack, onSettings, onSell, onPortfolio, onNotifications }) => {
   const { state, dispatch } = useCloutMarket();
   const [isFollowing, setIsFollowing] = useState(false);
   const [likes, setLikes] = useState<Record<string, { count: number, active: boolean }>>(
      Object.fromEntries([...POSTS, ...myPosts].map(p => [p.id, { count: parseCount(p.likes), active: false }]))
   );

   const isMe = selectedCreatorId === 'me';
   const creator = isMe ? creatorFromUser(currentUser) : CREATORS.find((item) => item.id === selectedCreatorId) ?? CREATORS[2];
   const profilePosts = useMemo(
      () => (isMe ? myPosts : POSTS.filter(p => p.creatorId === creator.id)),
      [creator.id, isMe, myPosts]
   );
   const supply = Math.round(state.shareSupply[creator.id] ?? (isMe ? 1 : 0));
   const holders = isMe ? 1 : Math.max(1, Math.round(state.pulse[creator.id]?.buyerCount ?? 8));
   const supplyPct = Math.min(100, Math.max(1, (supply / 10000) * 100));
   const changeIsPositive = !creator.change.trim().startsWith('-');
   const displayedSharePrice = `$${getSpotPrice(supply).toFixed(2)}`;

   const toggleLike = (id: string) => {
      setLikes(prev => {
         const current = prev[id] ?? { count: 0, active: false };
         return {
            ...prev,
            [id]: {
               count: current.active ? Math.max(0, current.count - 1) : current.count + 1,
               active: !current.active
            }
         };
      });
   };

   const shareProfile = async () => {
      const url = window.location.href;
      if (navigator.share) {
         navigator.share({
            title: `Check out ${creator.name} on CloutMarket`,
            url
         }).catch(() => { });
         return;
      }
      const ok = await copyTextToClipboard(url);
      alert(ok ? 'Link copied to clipboard.' : 'Copy not supported in this browser; share manually.');
   };

   return (
      <div className="bg-clout-bg pb-nav font-sans min-h-0">
         <header className="sticky top-0 z-30 px-4 sm:px-5 h-16 flex items-center justify-between border-b border-slate-200 bg-clout-bg/95 backdrop-blur-xl">
            <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm" aria-label="Back">
               <ArrowLeft size={20} />
            </button>
            <span className="font-black italic text-xl">{isMe ? 'My Profile' : 'Profile'}</span>
            <div className="flex gap-2">
               <button type="button" onClick={onNotifications} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm" aria-label="Notifications">
                  <Bell size={18} />
               </button>
               <button type="button" onClick={onSettings} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm" aria-label="Settings">
                  <SettingsIcon size={18} />
               </button>
            </div>
         </header>

         <main className="px-3 sm:px-4 pt-4 max-w-2xl mx-auto space-y-4">
            <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 hard-shadow space-y-4">
               <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  <Avatar size="xl" src={creator.avatar} isVerified={creator.isVerified} alt={creator.name} className="self-center sm:self-auto" />
                  <div className="min-w-0 text-center sm:text-left flex-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isMe ? `X @${currentUser.handle}` : `${creator.followers} followers`}</p>
                     <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-none break-words">{creator.name}</h1>
                     <p className="text-lg sm:text-xl text-slate-600 font-black break-all">@{creator.handle}</p>
                     {creator.bio && <p className="mt-2 text-sm font-bold text-slate-600 leading-snug">{creator.bio}</p>}
                  </div>
               </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
               <BrutalistCard variant="white" className="flex flex-col justify-between min-h-[6.5rem] p-3">
                  <span className="text-[10px] font-black uppercase opacity-60">Share price</span>
                  <div>
                     <span className="text-xl font-black">{displayedSharePrice}</span>
                     <p className={cn('text-[10px] font-bold flex items-center gap-1', changeIsPositive ? 'text-clout-green' : 'text-red-500')}>
                        <TrendingUp size={12} /> {creator.change}
                     </p>
                  </div>
               </BrutalistCard>

               <BrutalistCard variant="white" className="flex flex-col justify-between min-h-[6.5rem] p-3">
                  <span className="text-[10px] font-black uppercase opacity-60">{isMe ? 'Your holders' : 'Shareholders'}</span>
                  <div>
                     <span className="text-xl font-black tabular-nums">{holders.toLocaleString()}</span>
                     <p className="text-[10px] font-bold opacity-60">{isMe ? 'You claimed first' : 'Active market'}</p>
                  </div>
               </BrutalistCard>

               <BrutalistCard variant="white" className="flex flex-col justify-between min-h-[6.5rem] p-3 col-span-2 md:col-span-1">
                  <span className="text-[10px] font-black uppercase opacity-60">Supply sold</span>
                  <div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-clout-green" style={{ width: `${supplyPct}%` }} />
                     </div>
                     <p className="mt-2 text-[10px] font-bold opacity-70">{supply.toLocaleString()} / 10,000 shares</p>
                  </div>
               </BrutalistCard>
            </section>

            {isMe ? (
               <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StickerButton fullWidth onClick={onPortfolio} className="h-12 font-black text-sm" leftIcon={<BriefcaseBusiness size={20} strokeWidth={3} />}>
                     My holdings
                  </StickerButton>
                  <StickerButton fullWidth onClick={onSettings} variant="outline" className="h-12 font-black text-sm">
                     Settings
                  </StickerButton>
               </section>
            ) : (
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
                        onClick={() => {
                           setIsFollowing((prev) => {
                              if (!prev) dispatch({ type: 'FollowUser', creatorId: creator.id });
                              return !prev;
                           });
                        }}
                        leftIcon={isFollowing ? <Check size={20} /> : <UserPlus size={20} strokeWidth={3} />}
                     >
                        {isFollowing ? 'Following' : 'Follow'}
                     </StickerButton>
                     <button
                        type="button"
                        onClick={shareProfile}
                        aria-label="Share profile"
                        className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center hard-shadow-sm press-interaction shrink-0"
                     >
                        <Share2 size={24} />
                     </button>
                  </div>
               </section>
            )}

            <section className="pt-2">
               <div className="flex justify-between border-b border-slate-200 mb-4">
                  <button type="button" className="flex-1 pb-3 border-b-2 border-border-dark font-black text-xs uppercase">Posts</button>
                  <button type="button" onClick={() => alert('Holders list coming soon!')} className="flex-1 pb-3 border-b-2 border-transparent font-black text-xs uppercase opacity-40 px-2">Holders</button>
                  <button type="button" onClick={() => alert('Stats coming soon!')} className="flex-1 pb-3 border-b-2 border-transparent font-black text-xs uppercase opacity-40 px-2">Stats</button>
               </div>

               <div className="space-y-3">
                  {profilePosts.length === 0 ? (
                     <BrutalistCard variant="white" className="p-5 text-center">
                        <p className="text-sm font-black text-slate-500">No public posts yet.</p>
                     </BrutalistCard>
                  ) : profilePosts.map(post => (
                     <BrutalistCard key={post.id} className="p-4 space-y-3">
                        <div className="flex items-center gap-3 min-w-0">
                           <Avatar size="sm" src={post.creatorAvatar} alt={post.creatorName} />
                           <div className="min-w-0">
                              <p className="font-bold text-sm tracking-tight truncate">{post.creatorName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{post.timestamp}</p>
                           </div>
                        </div>
                        {post.image && (
                           <div className="rounded-lg border border-slate-200 overflow-hidden aspect-video hard-shadow-sm">
                              <img src={post.image} alt="content" className="w-full h-full object-cover" />
                           </div>
                        )}
                        <p className="text-sm font-medium leading-relaxed">{post.content}</p>
                        <div className="flex gap-4 pt-2">
                           <button
                              type="button"
                              onClick={() => toggleLike(post.id)}
                              className={cn(
                                 'flex items-center gap-1 text-xs font-black transition-colors press-interaction',
                                 likes[post.id]?.active ? 'text-red-500' : 'text-slate-600'
                              )}
                           >
                              <Heart size={16} fill={likes[post.id]?.active ? 'currentColor' : 'none'} strokeWidth={3} /> {formatCount(likes[post.id]?.count ?? 0)}
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
