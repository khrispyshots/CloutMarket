import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickerButton, BrutalistCard } from '../components/UI';
import { Twitter, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export const Signup: React.FC<{ onComplete: (handle: string) => void }> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const linkedHandle = 'frosthub';

  const handleTwitterConnect = () => {
    setIsConnecting(true);
    // Simulate real OAuth redirect/popup delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsSuccess(true);
      setTimeout(() => onComplete(linkedHandle), 1500);
    }, 2000);
  };

  return (
    <div className="bg-clout-bg flex flex-col font-sans px-5 py-6 items-center justify-center">
      <header className="w-full px-6 h-24 flex items-center justify-between max-w-2xl mx-auto">
        <div className="w-12"></div>
        <div className="flex gap-3">
          <div className="h-2 w-10 rounded-full bg-border-dark"></div>
          <div className="h-2 w-6 rounded-full bg-slate-200"></div>
          <div className="h-2 w-6 rounded-full bg-slate-200"></div>
        </div>
        <div className="w-12"></div>
      </header>
      <AnimatePresence mode="wait">
        {!isConnecting && !isSuccess ? (
          <motion.div
            key="signup-form"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-md space-y-10 text-center"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-border-dark leading-tight">
                Sign in with X
              </h1>
              <p className="text-slate-600 font-bold text-lg">We use your X username to create your clout name.</p>
            </div>

            <BrutalistCard variant="white" className="flex flex-col items-center py-12 space-y-6">
              <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center hard-shadow-sm rotate-3">
                <Twitter size={48} className="fill-current text-[#1DA1F2]" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">X identity check</p>
                <div className="h-1 w-12 bg-border-dark mx-auto rounded-full"></div>
              </div>
            </BrutalistCard>

            <div className="space-y-4 w-full">
              <StickerButton
                fullWidth
                onClick={handleTwitterConnect}
                className="h-16 text-lg relative overflow-hidden group shadow-lg"
                leftIcon={<Twitter size={24} className="fill-current text-[#1DA1F2]" />}
              >
                <span className="relative z-10">Connect with X</span>
                <motion.div
                  className="absolute inset-0 bg-[#1DA1F2]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileTap={{ scale: 0.95 }}
                />
              </StickerButton>

              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                Email login can be added later. Claiming a tradable clout name starts with X so the username is verifiable.
              </p>
            </div>

            <BrutalistCard variant="white" className="flex items-start gap-4 p-5 text-left bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} className="text-clout-green" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase leading-none mb-1">Free first share</h3>
                <p className="text-xs font-medium text-slate-700 leading-snug">After X sign in, you claim 1 of your 10,000 profile shares. The rest trade on your bonding curve.</p>
              </div>
            </BrutalistCard>

            <p className="text-[10px] font-medium text-slate-400 max-w-[280px] mx-auto uppercase tracking-widest">
              By continuing, you agree to our <a href="#" className="underline text-border-dark font-black">Terms</a> & <a href="#" className="underline text-border-dark font-black">Privacy</a>
            </p>
          </motion.div>
        ) : isConnecting ? (
          <motion.div
            key="connecting"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl border border-slate-200 bg-white hard-shadow flex items-center justify-center relative z-10">
                <Loader2 size={64} className="animate-spin text-border-dark" strokeWidth={3} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black">Connecting X...</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Reading @{linkedHandle}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="w-32 h-32 rounded-full border border-clout-green bg-white hard-shadow flex items-center justify-center">
              <CheckCircle2 size={64} className="text-clout-green" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black">Verified</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">@{linkedHandle} found</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
