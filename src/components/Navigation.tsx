import React from 'react';
import { Screen } from '../types';
import { Home, Compass, Wallet, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

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
      <div className="bg-white border-2 border-border-dark rounded-3xl hard-shadow flex justify-around items-center h-20 w-full max-w-lg pointer-events-auto overflow-hidden px-2 sm:px-4">
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
                'flex flex-col items-center justify-center transition-all px-2 sm:px-4 py-2 rounded-2xl gap-1 min-w-0 flex-1 max-w-[5.5rem]',
                isActive ? 'bg-clout-yellow border-2 border-border-dark hard-shadow-sm' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon size={isActive ? 22 : 24} className={cn(isActive && 'fill-current')} aria-hidden />
              <span className="font-black text-[8px] uppercase tracking-widest truncate w-full text-center">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export const TopAppBar: React.FC<{ onAvatarClick: () => void; onWalletClick: () => void }> = ({ onAvatarClick, onWalletClick }) => {
  return (
    <header className="bg-clout-bg/80 backdrop-blur-md flex justify-between items-center px-6 pt-[env(safe-area-inset-top,0px)] h-[calc(5rem+env(safe-area-inset-top,0px))] w-full z-40 fixed top-0 border-b-2 border-border-dark">
      <div className="flex items-center gap-3 min-w-0">
        <motion.button 
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onAvatarClick}
          aria-label="Open profile"
          className="w-12 h-12 shrink-0 rounded-2xl border-2 border-border-dark overflow-hidden hard-shadow-sm bg-white"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuTzJtdQCwJR7pgTlsMWgSyg0ySb1pcvXk7jhJCjKGDNxSentvnY9QinZNHtkucKU2UAEktdhzfWzUkaNkvPZ7N2Ao0zh3YUj8CyFaKhyAS3LoeJE_VIr_mVkK_m3IMPAMrMYeLJyKdSt_xQvxBTOxLiea-CqHjpwyFNK4T3Fmb2HcKrgLZs6lIfGaYWKJMo2u15fL4b_Fe_J24X6OghXOsfWxZSwJsZlMyFo7NscdLQ9nEsjCY9wJhYRS7WPEVumxO-hP9pa_LdU" 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </motion.button>
        <h1 className="text-2xl font-black italic tracking-tighter font-sans truncate">CM <span className="text-clout-yellow text-4xl">.</span></h1>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onWalletClick}
        aria-label="Open portfolio"
        className="w-12 h-12 shrink-0 rounded-2xl border-2 border-border-dark bg-clout-yellow flex items-center justify-center hard-shadow-sm"
      >
        <Wallet size={22} strokeWidth={2.5} className="text-border-dark" aria-hidden />
      </motion.button>
    </header>
  );
};
