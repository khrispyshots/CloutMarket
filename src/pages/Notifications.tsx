import React from 'react';
import { BrutalistCard } from '../components/UI';
import { NOTIFICATIONS } from '../constants';
import { ArrowLeft, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export const Notifications: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [readIds, setReadIds] = React.useState<string[]>([]);

  return (
    <div className="pb-nav max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 px-4 h-16 flex items-center justify-between border-b border-slate-200 bg-clout-bg/95 backdrop-blur-xl">
        <button type="button" onClick={onBack} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hard-shadow-sm press-interaction">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter">Notifications</h1>
        <span className="bg-white text-border-dark font-black text-[10px] uppercase px-3 py-1 rounded-full border border-slate-200 hard-shadow-sm">
          {Math.max(0, NOTIFICATIONS.length - readIds.length)} NEW
        </span>
      </header>

      <div className="flex flex-col gap-4 px-4 pt-4">
        {NOTIFICATIONS.map((notif) => (
          <BrutalistCard 
            key={notif.id}
            onClick={() => setReadIds((prev) => (prev.includes(notif.id) ? prev : [...prev, notif.id]))}
            variant="white"
            className={cn(
              "p-5 transition-all cursor-pointer",
              readIds.includes(notif.id) ? "opacity-50 grayscale-[0.5]" : "hard-shadow"
            )}
          >
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 hard-shadow-sm">
                <Bell size={20} className="text-border-dark" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">{notif.title}</span>
                  <span className="text-[8px] font-black uppercase text-slate-500">{notif.timestamp}</span>
                </div>
                <p className="font-bold text-sm leading-tight text-slate-800">
                   {notif.content}
                </p>
              </div>
            </div>
          </BrutalistCard>
        ))}
      </div>

      <div className="flex justify-center pt-8 px-4">
        <button 
          type="button"
          onClick={() => alert('No older notifications yet!')}
          className="bg-border-dark text-white border border-border-dark px-8 py-3 rounded-xl font-black text-xs uppercase hard-shadow press-interaction"
        >
          View Older
        </button>
      </div>
    </div>
  );
};
