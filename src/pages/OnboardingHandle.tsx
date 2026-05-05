import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { StickerButton, BrutalistCard, Avatar } from '../components/UI';
import { Check, ArrowLeft, Loader2, AtSign, ShieldCheck } from 'lucide-react';

export const OnboardingHandle: React.FC<{ xHandle: string; onComplete: () => void; onBack: () => void }> = ({ xHandle, onComplete, onBack }) => {
  const cleanHandle = useMemo(() => xHandle.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'frosthub', [xHandle]);
  const cloutName = `${cleanHandle}.clout`;
  const [isClaiming, setIsClaiming] = useState(false);

  const handleSubmit = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      onComplete();
    }, 1000);
  };

  return (
    <div className="bg-clout-bg flex flex-col font-sans min-h-0">
      <header className="px-6 h-20 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white hard-shadow-sm press-interaction" aria-label="Back">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex gap-2">
          <div className="h-2 w-10 rounded-full bg-border-dark"></div>
          <div className="h-2 w-10 rounded-full bg-border-dark"></div>
          <div className="h-2 w-10 rounded-full bg-clout-green"></div>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 px-6 flex flex-col items-center justify-center max-w-md mx-auto w-full pb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full space-y-8 text-center"
        >
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-border-dark">Claim your clout name</h1>
            <p className="text-slate-600 font-bold text-base">Your X username is reserved for you.</p>
          </div>

          <BrutalistCard variant="white" className="w-full p-6 text-center space-y-6">
            <Avatar
              size="xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrm0Zxh40hN1IObGQqX5dbXLesrIP3MjSs2eakjeKbfEPIVfGq4qb1tDbvCU21MK4UZtBD9lW8cHhbLnrjdqFZa6-cUpfcDcQyzdJz34T38seTbBXXwfzBn5BBK8jNOnSRQp6OCq1H5hA34JuV_3L8kP_gP1mLQ6UdobKAGH8YSuIB3-fY0XrFEfo8mr9cLCz8lE85Qznl8i9XYKCVpjyP5COwXnZNC9U1ACWWuETq9hFP_XhxPes5Hl0zf25tpxfQeyoP4mxLnDM"
              isVerified
            />

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Linked from X</p>
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <AtSign size={20} className="text-slate-400" />
                <span className="text-2xl font-black tracking-tight">{cloutName}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-clout-green px-4 py-2 rounded-full border border-emerald-100">
                <Check size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Free claim available</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-black">1</p>
                <p className="text-[8px] font-black uppercase text-slate-400">You own</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-black">10k</p>
                <p className="text-[8px] font-black uppercase text-slate-400">Max shares</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-black">$1.00</p>
                <p className="text-[8px] font-black uppercase text-slate-400">Start price</p>
              </div>
            </div>
          </BrutalistCard>

          <BrutalistCard variant="white" className="flex items-start gap-3 p-4 text-left">
            <ShieldCheck size={22} className="text-clout-green shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Your claimed share is tradable. Other users can buy your remaining shares, and the bonding curve updates the price automatically.
            </p>
          </BrutalistCard>

          <StickerButton fullWidth onClick={handleSubmit} disabled={isClaiming} className="h-14 text-sm">
            {isClaiming ? <Loader2 className="animate-spin" /> : `Claim ${cloutName}`}
          </StickerButton>
        </motion.div>
      </main>
    </div>
  );
};
