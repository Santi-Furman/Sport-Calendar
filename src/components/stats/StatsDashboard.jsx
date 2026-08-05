import React from 'react';
import { BarChart3, Flame } from 'lucide-react';
import { COLOR_MAP } from '../../constants/sportsData';

export default function StatsDashboard({ eventsMap, sports, currentStreak }) {
  const allEvents = Object.values(eventsMap).flat();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-indigo-400" />
        Tus Logros y Estadísticas
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">Total de Actividades</p>
          <p className="text-2xl font-extrabold text-white">{allEvents.length}</p>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl space-y-1 bg-amber-500/5">
          <p className="text-xs text-amber-400 font-medium">Racha Actual</p>
          <p className="text-2xl font-extrabold text-amber-300 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-amber-400" />
            {currentStreak} <span className="text-xs font-normal">días</span>
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Desglose por Actividad</h3>
        <div className="space-y-2">
          {sports.map((sport) => {
            const count = allEvents.filter(e => e.sport === sport.id).length;
            const percentage = allEvents.length > 0 ? Math.round((count / allEvents.length) * 100) : 0;
            const colorCfg = COLOR_MAP[sport.color] || COLOR_MAP['bg-purple-500'];

            return (
              <div key={sport.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>{sport.emoji}</span> {sport.label}
                  </span>
                  <span className="text-slate-400">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${colorCfg.bg}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}