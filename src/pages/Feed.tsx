import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { POSTS } from '../constants';
import type { Post } from '../types';
import { Heart, MessageCircle, Plus, Share2, X } from 'lucide-react';
import { cn, copyTextToClipboard } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';
import { DAILY_POINTS_CAP } from '../engine/config';

const ME_AVATAR =
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBPVpsRKHuRuOzQlOqUqi7Bfp7dlrib0uguDeolilblQoO4sMNEWKz6w90n7zWzIP7tTS7vV_irrgb2Dh-jFpUI11phZW1saxp-2N4zKsNCUV8sxFRnMK81JWCiQ7Qag6Jg6XJQUYhY0TeUszJ68O2O0QzSNYukVZ8k63fuL9vnkpaE1C6RG58JJQPqguFPQppk4ux4EeCiuwU7MZz4izu2tedl5VodA9bbjCWYka3DzmUSjPSRqP3g3qHkux157CysxBnmJ_CLw2E';

export const Feed: React.FC<{ onCreatorSelect: () => void; onInvest: () => void }> = ({ onCreatorSelect, onInvest }) => {
   const { state, dispatch, formatClout } = useCloutMarket();
   const parseCount = (c: string): number => {
      if (c.endsWith('k')) return parseFloat(c) * 1000;
      if (c.endsWith('m')) return parseFloat(c) * 1000000;
      return parseInt(c, 10) || 0;
   };

   const formatCount = (n: number): string => {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'm';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
      return n.toString();
   };

   const [likes, setLikes] = useState<Record<string, { count: number; active: boolean }>>(
      Object.fromEntries(POSTS.map((p) => [p.id, { count: parseCount(p.likes), active: false }]))
   );
   const [replies, setReplies] = useState<Record<string, { count: number; active: boolean }>>(
      Object.fromEntries(POSTS.map((p) => [p.id, { count: parseCount(p.comments), active: false }]))
   );
   const [myPosts, setMyPosts] = useState<Post[]>([]);
   const [composeOpen, setComposeOpen] = useState(false);
   const [draft, setDraft] = useState('');
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   useEffect(() => {
      if (composeOpen) {
         textareaRef.current?.focus();
      }
   }, [composeOpen]);

   useEffect(() => {
      if (!composeOpen) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setComposeOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
   }, [composeOpen]);

   const toggleLike = (post: Post, e: React.MouseEvent) => {
      e.stopPropagation();
      const id = post.id;
      let wasActive = false;
      flushSync(() => {
         setLikes((prev) => {
            wasActive = prev[id]?.active ?? false;
            return {
               ...prev,
               [id]: {
                  count: wasActive ? Math.max(0, prev[id].count - 1) : prev[id].count + 1,
                  active: !wasActive,
               },
            };
         });
      });
      if (!wasActive) dispatch({ type: 'LikeAdded', postId: id, creatorId: post.creatorId });
      else dispatch({ type: 'LikeRemoved', postId: id, creatorId: post.creatorId });
   };

   const toggleReply = (post: Post, e: React.MouseEvent) => {
      e.stopPropagation();
      const id = post.id;
      let wasActive = false;
      flushSync(() => {
         setReplies((prev) => {
            wasActive = prev[id]?.active ?? false;
            return {
               ...prev,
               [id]: {
                  count: wasActive ? Math.max(0, prev[id].count - 1) : prev[id].count + 1,
                  active: !wasActive,
               },
            };
         });
      });
      if (!wasActive) dispatch({ type: 'CommentAdded', postId: id, creatorId: post.creatorId });
   };

   const sharePost = async (post: Post, e: React.MouseEvent) => {
      e.stopPropagation();
      const url = window.location.href;
      if (navigator.share) {
         try {
            await navigator.share({ title: 'Check out this CloutMarket post!', url });
            dispatch({ type: 'Repost', postId: post.id, creatorId: post.creatorId });
         } catch {
            /* cancelled */
         }
         return;
      }
      const ok = await copyTextToClipboard(url);
      if (ok) dispatch({ type: 'Repost', postId: post.id, creatorId: post.creatorId });
      alert(ok ? 'Link copied to clipboard.' : 'Copy not supported in this browser; share manually.');
   };

   const publishPost = () => {
      const text = draft.trim();
      if (!text) return;
      const newPost: Post = {
         id: `me-${Date.now()}`,
         creatorId: 'me',
         creatorName: 'You',
         creatorHandle: 'you.clout',
         creatorAvatar: ME_AVATAR,
         content: text,
         likes: '0',
         comments: '0',
         timestamp: 'Just now',
      };
      dispatch({ type: 'PostCreated', postId: newPost.id, creatorId: 'me', contentLength: text.length });
      setMyPosts((p) => [newPost, ...p]);
      setLikes((prev) => ({ ...prev, [newPost.id]: { count: 0, active: false } }));
      setReplies((prev) => ({ ...prev, [newPost.id]: { count: 0, active: false } }));
      setDraft('');
      setComposeOpen(false);
   };

   const allPosts = [...myPosts, ...POSTS];

   return (
      <div className="px-3 sm:px-4 pb-nav w-full max-w-full pt-2 sm:pt-3">
         <div className="space-y-2 mb-3">
            <h2 className="text-2xl font-black tracking-tight leading-tight">Good Morning!</h2>
            <p className="text-slate-500 font-bold text-sm font-sans">Trade social influence today.</p>
         </div>

         <BrutalistCard variant="white" className="flex justify-between items-center gap-3 p-3 sm:p-4 mb-3">
            <div className="space-y-0.5 min-w-0">
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Your Clout Score</span>
               <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-black tabular-nums">{formatClout(state.cloutPoints)}</span>
                  <span className="text-[10px] font-bold text-white bg-clout-green px-1.5 py-0.5 rounded-full">Live</span>
               </div>
               <p className="text-[9px] font-bold text-slate-600 leading-tight">
                  Today +{Math.round(state.dailyPointsEarned)} / {DAILY_POINTS_CAP} pts cap
               </p>
            </div>
            <div className="bg-white border border-slate-200 p-1.5 rounded-full hard-shadow-sm shrink-0">
               <Avatar size="sm" src={ME_AVATAR} alt="Your profile" />
            </div>
         </BrutalistCard>

         <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 scrollbar-hide mb-3 snap-x snap-mandatory" role="tablist" aria-label="Feed filters">
            <button type="button" aria-selected className="snap-start shrink-0 whitespace-nowrap px-4 py-2 bg-border-dark text-white border border-border-dark rounded-full font-black text-[10px] uppercase hard-shadow-sm press-interaction">
               Trending
            </button>
            <button type="button" aria-selected={false} className="snap-start shrink-0 whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full font-black text-[10px] uppercase text-slate-500 hover:bg-slate-50 press-interaction">
               Following
            </button>
            <button type="button" aria-selected={false} className="snap-start shrink-0 whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full font-black text-[10px] uppercase text-slate-500 hover:bg-slate-50 press-interaction">
               New
            </button>
         </div>

         <section className="space-y-3">
            {allPosts.map((post) => (
               <BrutalistCard
                  key={post.id}
                  variant="white"
                  className="p-4 space-y-3"
               >
                  <div className="flex justify-between items-start gap-2">
                     {post.creatorId === 'me' ? (
                        <div className="flex items-center gap-2 text-left min-w-0">
                           <Avatar src={post.creatorAvatar} alt={post.creatorName} />
                           <div className="min-w-0">
                              <p className="font-bold text-slate-900 leading-tight text-sm truncate">{post.creatorName}</p>
                              <p className="text-[11px] font-medium text-slate-500">@{post.creatorHandle}</p>
                           </div>
                        </div>
                     ) : (
                        <button type="button" className="flex items-center gap-2 cursor-pointer text-left min-w-0" onClick={onCreatorSelect}>
                           <Avatar src={post.creatorAvatar} alt={post.creatorName} />
                           <div className="min-w-0">
                              <p className="font-bold text-slate-900 leading-tight text-sm truncate">{post.creatorName}</p>
                              <p className="text-[11px] font-medium text-slate-500">@{post.creatorHandle}</p>
                           </div>
                        </button>
                     )}
                     {post.creatorId !== 'me' && (
                        <StickerButton onClick={onInvest} variant="secondary" className="h-12 px-5 text-xs font-black uppercase tracking-tight shrink-0 shadow-lg">
                           Buy Clout
                        </StickerButton>
                     )}
                  </div>

                  {post.image && (
                     <div className="rounded-lg border border-slate-200 overflow-hidden h-36 hard-shadow-sm">
                        <img src={post.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                     </div>
                  )}

                  <p className="font-medium text-slate-800 leading-snug text-sm">{post.content}</p>

                  <div className="flex justify-between items-center pt-1 gap-2">
                     <div className="flex gap-3 shrink-0">
                        <button
                           type="button"
                           onClick={(e) => toggleLike(post, e)}
                           className={cn(
                              'flex items-center gap-1 group text-[11px] font-black transition-colors press-interaction',
                              likes[post.id]?.active ? 'text-red-500' : 'text-slate-600'
                           )}
                        >
                           <Heart size={15} fill={likes[post.id]?.active ? 'currentColor' : 'none'} strokeWidth={3} />{' '}
                           {formatCount(likes[post.id]?.count ?? 0)}
                        </button>
                        <button
                           type="button"
                           onClick={(e) => toggleReply(post, e)}
                           className={cn(
                              'flex items-center gap-1 group text-[11px] font-black transition-colors press-interaction',
                              replies[post.id]?.active ? 'text-clout-green' : 'text-slate-600'
                           )}
                           aria-label={replies[post.id]?.active ? 'Undo reply' : 'Reply'}
                        >
                           <MessageCircle size={15} strokeWidth={3} className={cn(replies[post.id]?.active && 'scale-110 transition-transform')} />{' '}
                           {formatCount(replies[post.id]?.count ?? 0)}
                        </button>
                        <button
                           type="button"
                           onClick={(e) => sharePost(post, e)}
                           className="flex items-center gap-1 group text-[11px] font-black text-slate-600 press-interaction"
                           aria-label="Share post"
                        >
                           <Share2 size={15} strokeWidth={3} />
                        </button>
                     </div>
                     <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter whitespace-nowrap">{post.timestamp}</span>
                  </div>
               </BrutalistCard>
            ))}
         </section>

         <button
            type="button"
            onClick={() => setComposeOpen(true)}
            aria-label="Compose post"
            className={cn(
               'fixed z-40 w-14 h-14 bg-border-dark text-white rounded-full border border-border-dark flex items-center justify-center hard-shadow press-interaction right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:right-8 transition-opacity',
               composeOpen && 'opacity-0 pointer-events-none'
            )}
         >
            <Plus size={28} strokeWidth={3} />
         </button>

         <AnimatePresence>
            {composeOpen && (
               <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="compose-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 overscroll-contain"
                  onClick={() => setComposeOpen(false)}
               >
                  <motion.div
                     initial={{ y: 40, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: 24, opacity: 0 }}
                     transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                     className="w-full max-w-lg bg-clout-bg border border-slate-200 rounded-2xl hard-shadow p-3 sm:p-4 max-h-[min(90dvh,28rem)] sm:max-h-[min(85dvh,32rem)] flex flex-col gap-3 overflow-y-auto"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="flex items-center justify-between gap-2">
                        <h2 id="compose-title" className="text-lg font-black">
                           New post
                        </h2>
                        <button
                           type="button"
                           aria-label="Close"
                           onClick={() => setComposeOpen(false)}
                           className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center press-interaction hard-shadow-sm"
                        >
                           <X size={20} />
                        </button>
                     </div>
                     <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="What is happening on the market?"
                        rows={5}
                        maxLength={280}
                        className="w-full min-h-[8rem] resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-border-dark/15"
                     />
                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>{280 - draft.length} left</span>
                     </div>
                     <StickerButton fullWidth onClick={publishPost} disabled={!draft.trim()} variant={draft.trim() ? 'primary' : 'outline'}>
                        Post
                     </StickerButton>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};
