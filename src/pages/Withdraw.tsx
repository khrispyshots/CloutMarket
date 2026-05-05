import React, { useState } from 'react';
import { BrutalistCard, StickerButton } from '../components/UI';
import { ArrowLeft, ArrowUpRight, CircleDollarSign, Landmark, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export const Withdraw: React.FC<{ onBack: () => void; onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const quickAmounts = ['100', '500', '1000'];

  const usd = parseFloat(amount);
  const amountOk = Number.isFinite(usd) && usd > 0;
  const addressOk = address.trim().length >= 8;
  const canSubmit = amountOk && addressOk;

  return (
    <div className="h-full min-h-0 flex flex-col bg-clout-bg w-full">
      <header className="shrink-0 h-16 px-4 sm:px-5 flex items-center justify-between border-b border-slate-200 bg-clout-bg/95 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic tracking-tight">Withdraw</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 pb-6 space-y-4 max-w-2xl mx-auto w-full">
        <section className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 hard-shadow space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available balance</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight tabular-nums">$42,850.24</h2>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hard-shadow-sm shrink-0">
              <Landmark size={22} strokeWidth={2.5} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Network</p>
              <p className="mt-1 text-sm font-black">Celo</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-emerald-50 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fee</p>
              <p className="mt-1 text-sm font-black text-clout-green">~$0.02</p>
            </div>
          </div>
        </section>

        <BrutalistCard variant="white" className="p-4 sm:p-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor="withdraw-amt" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Amount (USD)</label>
            <div className="relative">
              <CircleDollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="withdraw-amt"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-xl font-black outline-none focus:ring-2 focus:ring-border-dark/10 hard-shadow-sm font-mono"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={cn(
                    'h-10 rounded-xl border text-[10px] font-black uppercase press-interaction',
                    amount === value ? 'border-border-dark bg-border-dark text-white hard-shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                  )}
                >
                  ${value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="withdraw-addr" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Destination address</label>
            <input
              id="withdraw-addr"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or Celo address"
              autoComplete="off"
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-border-dark/10 hard-shadow-sm"
            />
          </div>
        </BrutalistCard>

        <BrutalistCard variant="white" className="p-4 space-y-3 text-xs font-bold text-slate-600">
          <div className="flex justify-between uppercase tracking-wide">
            <span>Network fee</span>
            <span className="text-border-dark">~$0.02</span>
          </div>
          <div className="flex justify-between uppercase tracking-wide">
            <span>You receive</span>
            <span className="font-black text-border-dark">{amountOk ? `$${usd.toFixed(2)}` : '-'}</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex gap-3 items-start text-[11px] leading-snug">
            <ShieldCheck size={18} className="text-clout-green shrink-0 mt-0.5" />
            <p>Withdrawals use your verified account and settle to the destination address after confirmation.</p>
          </div>
        </BrutalistCard>
      </main>

      <div className="shrink-0 p-4 safe-bottom bg-clout-bg/95 backdrop-blur border-t border-slate-200">
        <StickerButton
          fullWidth
          variant={canSubmit ? 'primary' : 'outline'}
          disabled={!canSubmit}
          onClick={canSubmit ? onComplete : undefined}
          className="h-14 text-sm"
          leftIcon={<ArrowUpRight size={18} strokeWidth={3} />}
        >
          {canSubmit ? 'Confirm withdrawal' : 'Enter amount & address'}
        </StickerButton>
      </div>
    </div>
  );
};
