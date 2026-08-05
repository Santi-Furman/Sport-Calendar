import React from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { MONTH_NAMES, DAY_NAMES, getDaysInMonth } from '../../utils/dateUtils';
import { COLOR_MAP } from '../../constants/sportsData';

export default function CalendarGrid({
  currentDate,
  setCurrentDate,
  selectedDateStr,
  setSelectedDateStr,
  events,
  sports,
  currentStreak,
  onGoToStats
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { days, firstDayIndex } = getDaysInMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Función auxiliar para obtener el objeto del deporte de forma limpia
  const getSportObject = (event) => {
    if (!event) return null;
    const key = event.sport || event.sportId || event.type;
    return sports.find(s => s.id === key || s.label?.toLowerCase() === key?.toLowerCase()) || null;
  };

  return (
    <div className="space-y-4">
      {/* Banner de Racha */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Racha Actual</p>
            <p className="text-sm font-bold text-amber-300">
              {currentStreak} {currentStreak === 1 ? 'Día' : 'Días seguidos'}
            </p>
          </div>
        </div>
        <button
          onClick={onGoToStats}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          Ver todo
        </button>
      </div>

      {/* Grid del Mes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white capitalize">
            {MONTH_NAMES[month]} {year}
          </h2>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-slate-500 font-semibold">
          {DAY_NAMES.map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12" />
          ))}

          {days.map(({ dayNumber, dateString }) => {
            const isSelected = dateString === selectedDateStr;
            const dayEvents = events[dateString] || [];
            const hasEvents = dayEvents.length > 0;

            let dayStyle = "bg-slate-950/40 text-slate-300 hover:bg-slate-800/80 border border-transparent";

            if (hasEvents) {
              const sportObj = getSportObject(dayEvents[0]);
              const colorKey = sportObj?.color || 'bg-purple-500';
              const colorCfg = COLOR_MAP[colorKey] || COLOR_MAP['bg-purple-500'];

              // Aplicamos las clases directas sin concatenar opacity opaca sobre Tailwind
              dayStyle = `bg-slate-900 ${colorCfg.text} border ${colorCfg.border}`;
            }

            if (isSelected) {
              dayStyle += " ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 font-bold scale-[1.02]";
            }

            return (
              <button
                key={dayNumber}
                onClick={() => setSelectedDateStr(dateString)}
                className={`h-12 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-between p-1.5 relative overflow-hidden ${dayStyle}`}
              >
                <span className="leading-none">{dayNumber}</span>
                {hasEvents && (
                  <div className="flex items-center justify-center gap-0.5 text-sm overflow-hidden w-full">
                    {dayEvents.slice(0, 2).map((ev, idx) => {
                      const sportObj = getSportObject(ev);
                      return <span key={idx}>{sportObj?.emoji || '🏆'}</span>;
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}