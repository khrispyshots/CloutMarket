import React from 'react';
import { BrutalistCard } from '../components/UI';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight, ExternalLink } from 'lucide-react';

export const Settings: React.FC<{ onBack: () => void; onLogout: () => void }> = ({ onBack, onLogout }) => {
  const handleItemClick = (label: string) => {
    alert(`${label} settings coming soon!`);
  };

  return (
    <div className="bg-clout-bg pb-nav font-sans min-h-0">
      <header className="px-5 h-16 flex items-center justify-between border-b border-slate-200 bg-clout-bg">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white press-interaction hard-shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black italic text-xl">Settings</span>
        <div className="w-10"></div>
      </header>
      
      <div className="px-4 pt-4 max-w-2xl mx-auto">
        <div className="mb-10 space-y-2">
          <p className="text-slate-500 font-bold text-sm">Manage your CloutMarket experience and security.</p>
        </div>

      <div className="space-y-6">
        {[
          { icon: User, label: 'Account', sub: 'Profile, Email, Currency' },
          { icon: Bell, label: 'Notifications', sub: 'Push, Email, Price Alerts' },
          { icon: Shield, label: 'Security', sub: 'Password, 2FA, Devices' },
        ].map((item, i) => (
          <BrutalistCard 
            key={i} 
            variant="white" 
            onClick={() => handleItemClick(item.label)}
            className="p-4 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center hard-shadow-sm">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{item.label}</h3>
                <p className="text-xs font-bold text-slate-600 font-sans tracking-tight">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </BrutalistCard>
        ))}

        <BrutalistCard 
          onClick={onLogout}
          className="p-4 flex items-center justify-between cursor-pointer group bg-white"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center hard-shadow-sm">
              <LogOut size={24} className="text-border-dark" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Logout</h3>
              <p className="text-xs font-bold text-slate-600 font-sans tracking-tight">Sign out of your session</p>
            </div>
          </div>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </BrutalistCard>
      </div>

      <div className="mt-12 bg-white border border-slate-200 rounded-lg p-6 hard-shadow-sm space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support</h4>
        <div className="space-y-1">
          {['Help Center', 'Privacy Policy', 'Terms of Service'].map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => handleItemClick(link)}
              className="w-full flex justify-between items-center py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors text-left bg-transparent"
            >
              <span className="text-sm font-black text-slate-700">{link}</span>
              <ExternalLink size={14} className="opacity-30 shrink-0" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
