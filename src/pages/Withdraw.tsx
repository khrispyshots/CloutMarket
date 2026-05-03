import React, { useState } from 'react';
import { BrutalistCard, StickerButton } from '../components/UI';
import { ArrowLeft, ArrowUpRight, Landmark } from 'lucide-react';

export const Withdraw: React.FC<{ onBack: () => void; onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const usd = parseFloat(amount);
  const amountOk = Number.isFinite(usd) && usd > 0;
  const addressOk = address.trim().length >= 8;
  const canSubmit = amountOk && addressOk;

  return (
    <div className="h-full min-h-0 flex flex-col bg-clout-bg px-5 max-w-2xl mx-auto">
      <header className="shrink-0 h-14 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)]">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border-dark bg-white press-interaction hard-shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter">Withdraw</h1>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto space-y-5 py-4 pb-36">
        <p className="text-xs font-bold text-slate-600">Send funds from your portfolio to an external wallet.</p>

        <BrutalistCard variant="green" className="p-4 flex gap-3 items-start">
          <Landmark className="shrink-0 mt-0.5" size={22} strokeWidth={2.5} />
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">Available</p>
            <p className="text-2xl font-black">$42,850.24</p>
          </div>
        </BrutalistCard>

        <div className="space-y-2">
          <label htmlFor="withdraw-amt" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Amount (USD)</label>
          <input
            id="withdraw-amt"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full h-14 bg-white border-2 border-border-dark rounded-xl px-4 text-lg font-black outline-none focus:bg-clout-yellow hard-shadow-sm font-mono"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="withdraw-addr" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Destination address</label>
          <input
            id="withdraw-addr"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x… or Celo address"
            autoComplete="off"
            className="w-full h-14 bg-white border-2 border-border-dark rounded-xl px-4 text-sm font-bold outline-none focus:bg-clout-yellow hard-shadow-sm"
          />
        </div>

        <BrutalistCard variant="surface" className="p-4 space-y-2 text-xs font-bold text-slate-600 bg-white">
          <div className="flex justify-between uppercase tracking-wide">
            <span>Network fee</span>
            <span className="text-border-dark">~$0.02</span>
          </div>
          <div className="flex justify-between uppercase tracking-wide">
            <span>You receive</span>
            <span className="font-black text-border-dark">{amountOk ? `$${usd.toFixed(2)}` : '—'}</span>
          </div>
        </BrutalistCard>
      </main>

      <div className="shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] bg-clout-bg/95 backdrop-blur border-t-2 border-border-dark/10">
        <StickerButton
          fullWidth
          variant={canSubmit ? 'secondary' : 'outline'}
          disabled={!canSubmit}
          onClick={canSubmit ? onComplete : undefined}
          leftIcon={<ArrowUpRight size={18} strokeWidth={3} />}
        >
          {canSubmit ? 'Confirm withdrawal' : 'Enter amount & address'}
        </StickerButton>
      </div>
    </div>
  );
};
