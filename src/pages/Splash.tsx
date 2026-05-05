import React from 'react';
import { motion } from 'motion/react';
import { StickerButton, BrutalistCard } from '../components/UI';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const Splash: React.FC<{ onComplete: () => void; onLogin: () => void }> = ({ onComplete, onLogin }) => {
  return (
    <div className="h-full min-h-0 flex flex-col items-center justify-between p-5 max-w-4xl mx-auto">
      <header className="w-full max-w-md shrink-0 h-12 flex items-center justify-start">
        <img src="/logo.svg" alt="CloutMarket" className="h-9 w-[10rem] object-contain object-left" />
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center w-full max-w-md space-y-5 py-4">
        <div className="relative w-full max-w-[190px] sm:max-w-[220px] aspect-square flex items-center justify-center shrink-0">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 3 }}
            className="w-40 h-40 sm:w-44 sm:h-44 bg-white border border-slate-200 rounded-[28px] flex items-center justify-center relative hard-shadow z-10 overflow-hidden"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1ljtGgGBiRWDfzOdjXS_FeFCBKGddo7ccLVZSFrAjWP73IXdiOv0geVoMLubgkk9bAYT18YOXUmv5ZV9ccjk-IyjZxoVG_JtwKA6Sq-1kKFGFQycPcNJJoZ4Gimm9JneUfvsLCtWW--1STzGOdvNyGd4bNiaHgksicoE-GYYfdBM_tuYaNmukZiwK6ne-uv0EKnyvfjz7OKs0wPMp1qFWRUo75qWvHR4IHS2rpElOwa_5dOFaU6OtaNeEwH3uFrWUNKbu3WBlT-8"
              alt="Hero"
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-border-dark p-4 border border-border-dark rounded-full hard-shadow-sm rotate-3">
                <TrendingUp size={44} className="text-white" strokeWidth={3} />
              </div>
            </div>
          </motion.div>

          <div className="absolute top-0 right-4 bg-white text-border-dark px-4 py-2 border border-slate-200 rounded-xl font-black text-xs hard-shadow-sm rotate-12">
            $CLOUT
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[0.95] text-border-dark">
              Own your <br />social market
            </h1>
            <p className="text-slate-500 font-bold text-sm">Claim your profile share and trade creator shares with a clean SocialFi flow.</p>
          </div>

          <BrutalistCard variant="surface" className="inline-block py-2 px-6 border-dashed opacity-80 bg-white">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Powered by Celo - Low fees - 100% owned</p>
          </BrutalistCard>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 safe-bottom shrink-0">
        <div className="space-y-3">
          <StickerButton
            fullWidth
            onClick={onComplete}
            className="h-16 text-lg font-black"
            rightIcon={<ArrowRight size={28} strokeWidth={3} />}
          >
            Get Started
          </StickerButton>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">
              Already a trader?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="text-border-dark font-black underline underline-offset-4 hover:text-clout-purple transition-colors bg-transparent border-0 p-0 cursor-pointer font-inherit text-inherit"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
