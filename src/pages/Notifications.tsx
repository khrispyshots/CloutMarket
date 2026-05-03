import React from 'react';
import { BrutalistCard, Avatar } from '../components/UI';
import { NOTIFICATIONS } from '../constants';
import { Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export const Notifications: React.FC = () => {
  const [readIds, setReadIds] = React.useState<string[]>([]);

  return (
    <div className="px-4 pb-nav space-y-4 pt-3 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter">Notifications</h1>
        <span className="bg-clout-yellow text-border-dark font-black text-[10px] uppercase px-3 py-1 rounded-full border-2 border-border-dark hard-shadow-sm">
          {Math.max(0, NOTIFICATIONS.length - readIds.length)} NEW
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {NOTIFICATIONS.map((notif) => (
          <BrutalistCard 
            key={notif.id}
            onClick={() => setReadIds((prev) => (prev.includes(notif.id) ? prev : [...prev, notif.id]))}
            variant={notif.color === 'clout-green' ? 'green' : notif.color === 'clout-yellow' ? 'yellow' : 'purple'}
            className={cn(
              "p-5 transition-all cursor-pointer",
              readIds.includes(notif.id) ? "opacity-50 grayscale-[0.5]" : "hard-shadow"
            )}
          >
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full border-2 border-border-dark bg-white flex items-center justify-center shrink-0 hard-shadow-sm">
                <Bell size={20} className={cn("text-border-dark", !readIds.includes(notif.id) && "animate-bounce")} />
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

      <div className="flex justify-center pt-8">
        <button 
          type="button"
          onClick={() => alert('No older notifications yet!')}
          className="bg-clout-yellow border-2 border-border-dark px-8 py-3 rounded-xl font-black text-xs uppercase hard-shadow press-interaction"
        >
          View Older
        </button>
      </div>
    </div>
  );
};
