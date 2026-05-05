import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrutalistCard, StickerButton } from '../components/UI';
import { ArrowRight, BarChart3, MessageSquare, UsersRound } from 'lucide-react';

const slides = [
  {
    icon: MessageSquare,
    title: 'Your social account becomes a market',
    body: 'Connect X, claim your clout name, and let people back your public reputation without crypto clutter.',
  },
  {
    icon: UsersRound,
    title: 'Every profile has 10,000 shares',
    body: 'You receive 1 share when you register. The remaining supply can be bought and sold by the community.',
  },
  {
    icon: BarChart3,
    title: 'Prices move on a bonding curve',
    body: 'When demand rises, the next share costs more. When shares are sold, the curve adjusts the price down.',
  },
];

export const OnboardingWelcome: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  return (
    <div className="bg-clout-bg flex flex-col font-sans min-h-0">
      <header className="px-6 h-20 flex items-center justify-between max-w-2xl mx-auto w-full">
        <span className="font-black italic text-xl tracking-tighter">CloutMarket</span>
        <div className="flex gap-2" aria-label={`Onboarding step ${index + 1} of ${slides.length}`}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-9 bg-border-dark' : 'w-5 bg-slate-200'}`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full pb-24 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full space-y-8"
          >
            <div className="mx-auto h-20 w-20 rounded-3xl bg-white border border-slate-200 hard-shadow flex items-center justify-center">
              <Icon size={34} strokeWidth={2.5} />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">{slide.title}</h1>
              <p className="text-slate-600 font-bold text-base leading-relaxed">{slide.body}</p>
            </div>

            <BrutalistCard variant="white" className="p-4 text-left">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-black">10k</p>
                  <p className="text-[9px] font-black uppercase text-slate-400">Max supply</p>
                </div>
                <div>
                  <p className="text-xl font-black">1</p>
                  <p className="text-[9px] font-black uppercase text-slate-400">Free claim</p>
                </div>
                <div>
                  <p className="text-xl font-black">Curve</p>
                  <p className="text-[9px] font-black uppercase text-slate-400">Pricing</p>
                </div>
              </div>
            </BrutalistCard>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="shrink-0 px-5 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-lg mx-auto flex gap-3">
          {index > 0 && (
            <StickerButton variant="outline" onClick={() => setIndex((i) => i - 1)} className="h-14 px-6">
              Back
            </StickerButton>
          )}
          <StickerButton
            fullWidth
            onClick={isLast ? onComplete : () => setIndex((i) => i + 1)}
            rightIcon={<ArrowRight size={20} strokeWidth={3} />}
            className="h-14 text-sm"
          >
            {isLast ? 'Continue with X' : 'Next'}
          </StickerButton>
        </div>
      </footer>
    </div>
  );
};
