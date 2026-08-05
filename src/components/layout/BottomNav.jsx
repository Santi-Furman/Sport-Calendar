import React from 'react';
import { Calendar as CalendarIcon, BarChart3, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'stats', label: 'Rachas', icon: BarChart3 },
    { id: 'settings', label: 'Actividades', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 z-20">
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === id ? 'text-indigo-400' : 'text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}