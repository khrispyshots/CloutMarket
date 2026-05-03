import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StickerButton, BrutalistCard, Avatar } from '../components/UI';
import { Check, ArrowLeft, Loader2, AtSign } from 'lucide-react';

export const OnboardingHandle: React.FC<{ onComplete: () => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [handle, setHandle] = useState('frosthub');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      onComplete();
    }, 1200);
  };

  return (
    <div className="h-full min-h-0 bg-clout-bg flex flex-col font-sans overflow-hidden">
      <header className="px-6 h-24 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-border-dark bg-white hard-shadow-sm press-interaction">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex gap-3">
            <div className="h-2 w-10 rounded-full bg-clout-purple border-2 border-border-dark"></div>
            <div className="h-2 w-10 rounded-full bg-clout-yellow border-2 border-border-dark"></div>
            <div className="h-2 w-6 rounded-full bg-slate-200 border-2 border-slate-300"></div>
        </div>
        <div className="w-12"></div>
      </header>

      <main className="flex-1 px-8 flex flex-col items-center justify-center max-w-md mx-auto w-full pb-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full space-y-10 text-center"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter leading-none text-border-dark">Claim your <br/>social vault</h1>
            <p className="text-slate-500 font-bold text-lg">Every great trader needs a handle.</p>
          </div>

          <BrutalistCard variant="yellow" className="w-full flex flex-col items-center p-10 text-center space-y-8 bg-white overflow-visible">
             <div className="relative -mt-20">
                <div className="absolute inset-0 bg-clout-yellow blur-2xl opacity-40 rounded-full"></div>
                <Avatar size="xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrm0Zxh40hN1IObGQqX5dbXLesrIP3MjSs2eakjeKbfEPIVfGq4qb1tDbvCU21MK4UZtBD9lW8cHhbLnrjdqFZa6-cUpfcDcQyzdJz34T38seTbBXXwfzBn5BBK8jNOnSRQp6OCq1H5hA34JuV_3L8kP_gP1mLQ6UdobKAGH8YSuIB3-fY0XrFEfo8mr9cLCz8lE85Qznl8i9XYKCVpjyP5COwXnZNC9U1ACWWuETq9hFP_XhxPes5Hl0zf25tpxfQeyoP4mxLnDM" className="hard-shadow-lg scale-125 border-4 border-white" />
                <div className="absolute -bottom-4 -right-4 bg-clout-green border-2 border-border-dark rounded-2xl p-2 hard-shadow scale-110">
                  <Check size={28} strokeWidth={4} className="text-white" />
                </div>
             </div>

             <div className="space-y-4 pt-10 w-full">
                <div className="relative group w-full">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <AtSign className="text-clout-yellow" size={24} strokeWidth={4} />
                    </div>
                    <input 
                        type="text" 
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase())}
                        className="w-full h-20 bg-white border-2 border-border-dark rounded-2xl pl-16 pr-6 text-2xl font-black focus:bg-clout-purple/5 outline-none transition-all hard-shadow focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                        placeholder="yourname"
                    />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-clout-green/10 text-clout-green px-4 py-2 rounded-full border-2 border-clout-green/20">
                      <div className="w-2 h-2 rounded-full bg-clout-green animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Handle Available</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secured on decentralized ledger</p>
                </div>
             </div>
          </BrutalistCard>

          <div className="w-full pt-4 space-y-6">
            <StickerButton 
                fullWidth 
                onClick={handleSubmit}
                disabled={isValidating || handle.length < 3}
                className="h-16 text-lg"
            >
              {isValidating ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
            </StickerButton>
            
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group cursor-pointer hover:text-border-dark transition-colors">
              Registration Fee: <span className="text-clout-green">$0.00 (Promo)</span>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="h-20 flex items-center justify-center border-t-2 border-border-dark/5">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Permanent decentralized registration</p>
      </footer>
    </div>
  );
};
