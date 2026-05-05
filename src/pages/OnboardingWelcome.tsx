import React from 'react';
import { motion } from 'motion/react';
import { BrutalistCard, StickerButton } from '../components/UI';
import { Star, ArrowRight, Zap, Target, Trophy } from 'lucide-react';

export const OnboardingWelcome: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="bg-clout-bg flex flex-col font-sans">
      <header className="px-6 h-24 flex items-center justify-between max-w-2xl mx-auto w-full">
        <span className="font-black italic text-2xl tracking-tighter">CloutMarket</span>
        <div className="flex gap-3">
          <div className="h-2 w-10 rounded-full bg-border-dark"></div>
          <div className="h-2 w-10 rounded-full bg-slate-300"></div>
          <div className="h-2 w-10 rounded-full bg-clout-green"></div>
        </div>
      </header>

      <main className="flex-1 px-8 flex flex-col items-center justify-center max-w-lg mx-auto w-full pb-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full space-y-12"
        >
          <div className="space-y-6 relative">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-clout-green border border-white hard-shadow rotate-3 relative z-10">
              <Trophy size={40} className="text-white" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black italic tracking-tighter leading-none">You're in!</h1>
              <p className="text-slate-500 font-bold text-lg uppercase tracking-widest text-sm italic">Status: verified explorer</p>
            </div>
          </div>

          <BrutalistCard className="w-full bg-white p-10 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-border-dark"></div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Genesis Reward</span>
              <h2 className="text-6xl font-black tracking-tighter text-slate-900">+500 PTS</h2>
            </div>

            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-8 py-3 hard-shadow-sm rotate-1">
              <Star size={20} fill="currentColor" strokeWidth={3} />
              <span className="font-black text-base uppercase italic">Genesis Badge</span>
            </div>

            <div className="w-full pt-8 space-y-3">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Level Progress</span>
                <span className="text-clout-green">Alpha Phase</span>
              </div>
              <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-2xl p-1 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-clout-green rounded-xl"
                />
              </div>
            </div>
          </BrutalistCard>

          <div className="grid grid-cols-2 gap-4">
            <BrutalistCard variant="white" className="flex flex-col items-center gap-2 py-6 bg-white border-dashed">
              <Zap size={24} className="text-clout-purple" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Early Access</span>
            </BrutalistCard>
            <BrutalistCard variant="white" className="flex flex-col items-center gap-2 py-6 bg-white border-dashed">
              <Target size={24} className="text-clout-green" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Airdrop Ready</span>
            </BrutalistCard>
          </div>

          <StickerButton
            fullWidth
            onClick={onComplete}
            rightIcon={<ArrowRight size={24} strokeWidth={3} />}
            className="h-20 text-xl font-black shadow-xl"
          >
            Start Trading
          </StickerButton>
        </motion.div>
      </main>

      <footer className="h-20 flex items-center justify-center border-t border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Permanent decentralized registration</p>
      </footer>
    </div>
  );
};
