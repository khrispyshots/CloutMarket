import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Wallet } from 'lucide-react';
import { ConnectButton, lightTheme, useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { BrutalistCard, StickerButton } from '../components/UI';
import { celoMainnet, cloutMarketWallets, thirdwebAppMetadata, thirdwebClient } from '../web3/thirdweb';

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const OnboardingWallet: React.FC<{
  xHandle: string;
  onComplete: (walletAddress: string) => void;
  onBack: () => void;
}> = ({ xHandle, onComplete, onBack }) => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [statusText, setStatusText] = useState('');

  const cloutName = useMemo(() => `${xHandle.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'frosthub'}.clout`, [xHandle]);
  const walletAddress = account?.address ?? '';
  const isCeloMainnet = activeChain?.id === celoMainnet.id;
  const canContinue = Boolean(walletAddress) && isCeloMainnet;

  useEffect(() => {
    if (!walletAddress) {
      setStatusText('Connect with Google, email, Valora, MetaMask, or Rabby.');
      return;
    }
    if (!isCeloMainnet) {
      setStatusText('Wallet connected. Switch to Celo Mainnet to continue.');
      return;
    }
    setStatusText('Wallet connected on Celo Mainnet.');
  }, [isCeloMainnet, walletAddress]);

  return (
    <div className="h-full min-h-0 bg-clout-bg flex flex-col font-sans">
      <header className="shrink-0 px-5 h-16 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white hard-shadow-sm press-interaction" aria-label="Back">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex gap-2">
          <div className="h-2 w-10 rounded-full bg-border-dark"></div>
          <div className="h-2 w-10 rounded-full bg-clout-green"></div>
          <div className="h-2 w-10 rounded-full bg-slate-200"></div>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex items-center justify-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-border-dark leading-tight">Connect wallet</h1>
            <p className="text-slate-600 font-bold text-base">
              @{xHandle} is verified. Connect a wallet on Celo Mainnet to claim {cloutName}.
            </p>
          </div>

          <BrutalistCard variant="white" className="p-5 sm:p-6 space-y-5">
            <div className="mx-auto w-24 h-24 rounded-3xl border border-slate-200 bg-slate-50 flex items-center justify-center hard-shadow-sm -rotate-2">
              {canContinue ? <Check size={48} className="text-clout-green" strokeWidth={3} /> : <Wallet size={48} className="text-border-dark" strokeWidth={2.5} />}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Required network</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-emerald-50 p-3">
                  <p className="text-lg font-black text-clout-green">42220</p>
                  <p className="text-[8px] font-black uppercase text-slate-500">Celo Mainnet</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-lg font-black">CELO</p>
                  <p className="text-[8px] font-black uppercase text-slate-500">Gas token</p>
                </div>
              </div>
            </div>

            <div className="thirdweb-connect-shell">
              <ConnectButton
                client={thirdwebClient}
                chain={celoMainnet}
                chains={[celoMainnet]}
                wallets={cloutMarketWallets}
                recommendedWallets={cloutMarketWallets}
                showAllWallets={false}
                appMetadata={thirdwebAppMetadata}
                theme={lightTheme({
                  colors: {
                    accentButtonBg: '#151718',
                    accentButtonText: '#ffffff',
                    primaryText: '#151718',
                    modalBg: '#ffffff',
                    borderColor: '#e2e8f0',
                  },
                })}
                connectButton={{
                  label: 'Connect wallet',
                  className: 'thirdweb-connect-button',
                }}
                switchButton={{
                  label: 'Switch to Celo',
                  className: 'thirdweb-connect-button',
                }}
                detailsButton={{
                  className: 'thirdweb-connect-button',
                  displayBalanceToken: {
                    [celoMainnet.id]: 'native',
                  },
                }}
                detailsModal={{
                  hideBuyFunds: true,
                  hideSendFunds: true,
                  hideReceiveFunds: true,
                }}
                connectModal={{
                  size: 'compact',
                  title: 'Connect to CloutMarket',
                  titleIcon: '/logo.svg',
                  showThirdwebBranding: false,
                }}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Connection status</p>
              <p className="mt-1 text-sm font-black text-border-dark">{walletAddress ? shortAddress(walletAddress) : 'No wallet connected'}</p>
              <p className="mt-1 text-xs font-bold text-slate-600">{statusText}</p>
            </div>
          </BrutalistCard>

          <BrutalistCard variant="white" className="flex items-start gap-3 p-4 text-left">
            <ShieldCheck size={22} className="text-clout-green shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              thirdweb handles the in-app wallet and supported wallet connections. The claim step stays locked until the active wallet is on Celo Mainnet.
            </p>
          </BrutalistCard>

          <StickerButton fullWidth onClick={() => onComplete(walletAddress)} disabled={!canContinue} variant={canContinue ? 'primary' : 'outline'} className="h-14 text-sm">
            Continue to claim profile
          </StickerButton>
        </motion.div>
      </main>
    </div>
  );
};
