import React from 'react';
import { Screen } from '../types';
import { Home, Compass, Wallet, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useCloutMarket } from '../engine/CloutMarketContext';

interface NavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNavBar: React.FC<NavProps> = ({ activeScreen, onNavigate }) => {
  // Redundant check removed as parent App.tsx now handles conditional rendering

  const NAV_ITEMS = [
    { id: Screen.Feed, label: 'Home', icon: Home },
    { id: Screen.Discover, label: 'Discover', icon: Compass },
    { id: Screen.Portfolio, label: 'Portfolio', icon: Wallet },
    { id: Screen.Notifications, label: 'Alerts', icon: Bell },
    { id: Screen.Profile, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl hard-shadow flex justify-around items-center min-h-[4rem] h-auto py-1.5 w-full max-w-lg pointer-events-auto overflow-hidden px-1.5 sm:px-3 gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center transition-all px-1.5 sm:px-3 py-1.5 rounded-xl gap-0.5 min-w-0 flex-1 max-w-[5.5rem] touch-manipulation',
                isActive ? 'bg-slate-950 text-white hard-shadow-sm' : 'text-slate-400 hover:text-slate-700'
              )}
            >
              <Icon size={isActive ? 20 : 22} aria-hidden />
              <span className="font-extrabold text-[7px] sm:text-[8px] uppercase tracking-wide sm:tracking-widest truncate w-full text-center leading-tight">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export const TopAppBar: React.FC<{ onAvatarClick: () => void; onWalletClick: () => void }> = ({ onAvatarClick, onWalletClick }) => {
  const { state, formatClout } = useCloutMarket();
  return (
    <header className="bg-clout-bg/92 backdrop-blur-xl fixed top-0 inset-x-0 z-40 border-b border-slate-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-xl mx-auto w-full h-16 sm:h-20 flex items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex items-center min-w-0 flex-1">
          <img src="/logo.svg" alt="CloutMarket" className="h-9 w-[10rem] object-contain object-left shrink-0" />
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0">
          <div className="hidden sm:flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 hard-shadow-sm max-w-[4.25rem] sm:max-w-none" title="Clout points (event-driven)">
            <span className="text-[9px] sm:text-[10px] font-black text-border-dark tabular-nums truncate">{formatClout(state.cloutPoints)}</span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onWalletClick}
            aria-label="Open portfolio"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-border-dark bg-border-dark flex items-center justify-center hard-shadow-sm touch-manipulation"
          >
            <Wallet size={20} strokeWidth={2.5} className="text-white" aria-hidden />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onAvatarClick}
            aria-label="Open profile"
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl border border-slate-200 overflow-hidden hard-shadow-sm bg-white touch-manipulation"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuTzJtdQCwJR7pgTlsMWgSyg0ySb1pcvXk7jhJCjKGDNxSentvnY9QinZNHtkucKU2UAEktdhzfWzUkaNkvPZ7N2Ao0zh3YUj8CyFaKhyAS3LoeJE_VIr_mVkK_m3IMPAMrMYeLJyKdSt_xQvxBTOxLiea-CqHjpwyFNK4T3Fmb2HcKrgLZs6lIfGaYWKJMo2u15fL4b_Fe_J24X6OghXOsfWxZSwJsZlMyFo7NscdLQ9nEsjCY9wJhYRS7WPEVumxO-hP9pa_LdU"
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
