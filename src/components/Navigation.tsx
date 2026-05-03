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
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-4 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="bg-white border-2 border-border-dark rounded-2xl sm:rounded-3xl hard-shadow flex justify-around items-center min-h-[4.25rem] h-auto py-1.5 w-full max-w-lg pointer-events-auto overflow-hidden px-1.5 sm:px-3 gap-0.5">
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
                'flex flex-col items-center justify-center transition-all px-1.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl gap-0.5 min-w-0 flex-1 max-w-[5.5rem] touch-manipulation',
                isActive ? 'bg-clout-yellow border-2 border-border-dark hard-shadow-sm' : 'text-border-dark/40 hover:text-border-dark/70'
              )}
            >
              <Icon size={isActive ? 20 : 22} className={cn(isActive && 'fill-current')} aria-hidden />
              <span className="font-black text-[7px] sm:text-[8px] uppercase tracking-wide sm:tracking-widest truncate w-full text-center leading-tight">{item.label}</span>
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
    <header className="bg-clout-bg/90 backdrop-blur-md fixed top-0 inset-x-0 z-40 border-b-2 border-border-dark pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-lg mx-auto w-full h-14 sm:h-16 flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onAvatarClick}
            aria-label="Open profile"
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl sm:rounded-2xl border-2 border-border-dark overflow-hidden hard-shadow-sm bg-white touch-manipulation"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuTzJtdQCwJR7pgTlsMWgSyg0ySb1pcvXk7jhJCjKGDNxSentvnY9QinZNHtkucKU2UAEktdhzfWzUkaNkvPZ7N2Ao0zh3YUj8CyFaKhyAS3LoeJE_VIr_mVkK_m3IMPAMrMYeLJyKdSt_xQvxBTOxLiea-CqHjpwyFNK4T3Fmb2HcKrgLZs6lIfGaYWKJMo2u15fL4b_Fe_J24X6OghXOsfWxZSwJsZlMyFo7NscdLQ9nEsjCY9wJhYRS7WPEVumxO-hP9pa_LdU"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-2xl font-black italic tracking-tighter font-sans truncate leading-none">
              CM <span className="text-clout-yellow text-2xl sm:text-4xl">.</span>
            </h1>
            <span className="text-[9px] font-black uppercase text-slate-500 truncate hidden sm:block">
              Clout {formatClout(state.cloutPoints)} pts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center rounded-full border-2 border-border-dark bg-white px-2 py-1 hard-shadow-sm max-w-[4.25rem] sm:max-w-none" title="Clout points (event-driven)">
            <span className="text-[9px] sm:text-[10px] font-black text-border-dark tabular-nums truncate">{formatClout(state.cloutPoints)}</span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onWalletClick}
            aria-label="Open portfolio"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 border-border-dark bg-clout-yellow flex items-center justify-center hard-shadow-sm touch-manipulation"
          >
            <Wallet size={20} strokeWidth={2.5} className="text-border-dark" aria-hidden />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
