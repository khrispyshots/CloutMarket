import React, { useState } from 'react';
import { BrutalistCard, StickerButton, Avatar } from '../components/UI';
import { ArrowLeft, TrendingDown, CircleDollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

export const SellToken: React.FC<{ onBack: () => void; onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [tokenAmount, setTokenAmount] = useState('');
  const [asset, setAsset] = useState<'CELO' | 'cUSD'>('CELO');

  const priceUsd = 14.2;
  const tokens = parseFloat(tokenAmount);
  const tokensValid = Number.isFinite(tokens) && tokens > 0;
  const usdEstimate = tokensValid ? (tokens * priceUsd).toFixed(2) : '0.00';

  return (
    <div className="h-full min-h-0 flex flex-col bg-clout-bg px-5 max-w-2xl mx-auto">
      <header className="shrink-0 h-14 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)]">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-border-dark bg-white press-interaction hard-shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter">Sell token</h1>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto space-y-6 py-4 pb-36">
        <BrutalistCard variant="purple" className="flex items-center gap-3 p-4">
          <Avatar size="lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDaH8uQYDQu4nDQ-w-CN1e_m2xXl92IV1ry2K-bWpiUKYYF-T_apF7pMyMJRPrhmaKmMpKxSzzwjIOYd3M93Zi8kzV8la6l0dh0BstHLqwGlwagKbmXSWj9PnlwDavjOyMJ2SeHnu7hhaHbwEt8LC9eyPg8xWk2ietY4VSzkiuNyHsgzO4bku1VlGZ3DBtZ8lPz7Wwbx3UUnYyWyGHpPdVxXYN11ZnKB5KptlMB0F8n30-xNPREkGPjtu5K1Cg4FX-Ajd-Bodi2QU" isVerified />
          <div>
            <h2 className="text-lg font-black">Alex Rivers</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              <TrendingDown size={12} strokeWidth={3} />
              Price: $14.20 / ALEX
            </div>
          </div>
        </BrutalistCard>

        <section className="text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">You receive (est.)</p>
          <p className="text-4xl font-black tracking-tighter">${usdEstimate}</p>
          <p className="text-xs font-bold text-slate-500">Holdings: 142.5 ALEX</p>
        </section>

        <div className="space-y-2">
          <label htmlFor="sell-tokens" className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Amount to sell (ALEX)</label>
          <div className="relative">
            <input
              id="sell-tokens"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.0001"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-16 bg-white border-2 border-border-dark rounded-xl px-4 pr-24 text-xl font-black outline-none focus:bg-clout-pink transition-colors hard-shadow-sm font-mono"
            />
            <button type="button" onClick={() => setTokenAmount('71.25')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-clout-yellow px-3 py-1.5 border-2 border-border-dark rounded-full text-[10px] font-black uppercase hard-shadow-sm press-interaction">
              HALF
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 px-0.5">Receive as</p>
          <div className="grid grid-cols-2 gap-3">
            <BrutalistCard
              onClick={() => setAsset('CELO')}
              className={cn(
                'flex flex-col items-center gap-1.5 py-4 cursor-pointer border-2',
                asset === 'CELO' ? 'bg-clout-yellow border-border-dark' : 'bg-white border-border-dark opacity-70'
              )}
            >
              <CircleDollarSign className="text-[#35D07F]" size={22} />
              <span className="text-xs font-black uppercase">CELO</span>
            </BrutalistCard>
            <BrutalistCard
              onClick={() => setAsset('cUSD')}
              variant="green"
              className={cn(
                'flex flex-col items-center gap-1.5 py-4 cursor-pointer border-2',
                asset === 'cUSD' ? 'border-border-dark' : 'border-border-dark opacity-70'
              )}
            >
              <CircleDollarSign className="text-[#45D0C5]" size={22} />
              <span className="text-xs font-black uppercase">cUSD</span>
            </BrutalistCard>
          </div>
        </div>
      </main>

      <div className="shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] bg-clout-bg/95 backdrop-blur border-t-2 border-border-dark/10">
        <StickerButton
          fullWidth
          variant={tokensValid ? 'secondary' : 'outline'}
          disabled={!tokensValid}
          onClick={tokensValid ? onComplete : undefined}
        >
          {tokensValid ? `Sell ${tokens} ALEX` : 'Enter amount to sell'}
        </StickerButton>
      </div>
    </div>
  );
};
