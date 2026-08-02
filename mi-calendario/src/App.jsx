import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Activity, 
  Trophy, 
  Trash2,
  Calendar as CalendarIcon,
  Flame,
  RotateCcw
} from 'lucide-react';

const ACTIVITIES = [
  { id: 'gym', label: 'Gimnasio', emoji: '🏋️‍♂️', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Dumbbell },
  { id: 'practice', label: 'Práctica', emoji: '⚽', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Activity },
  { id: 'match', label: 'Partido', emoji: '🏆', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Trophy },
];

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const EmojiCarousel = ({ activities }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activities.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [activities.length]);

  if (!activities || activities.length === 0) return null;

  const currentAct = ACTIVITIES.find(a => a.id === activities[index]);

  return (
    <div className="relative h-6 w-6 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${activities[index]}-${index}`}
          initial={{ opacity: 0, y: 8, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="text-base select-none absolute"
        >
          {currentAct?.emoji}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('sports_calendar_logs');
    return saved ? JSON.parse(saved) : {
      [todayStr]: ['gym', 'match']
    };
  });

  useEffect(() => {
    localStorage.setItem('sports_calendar_logs', JSON.stringify(logs));
  }, [logs]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startingDayIndex = firstDayOfMonth.getDay() - 1;
  if (startingDayIndex === -1) startingDayIndex = 6;

  const totalDays = lastDayOfMonth.getDate();
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Cálculo de estadísticas del mes
  const stats = useMemo(() => {
    let gymCount = 0;
    let practiceCount = 0;
    let matchCount = 0;

    Object.entries(logs).forEach(([date, acts]) => {
      if (date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
        if (acts.includes('gym')) gymCount++;
        if (acts.includes('practice')) practiceCount++;
        if (acts.includes('match')) matchCount++;
      }
    });

    return { gymCount, practiceCount, matchCount };
  }, [logs, year, month]);

  const toggleActivity = (actId) => {
    const currentList = logs[selectedDateStr] || [];
    const updated = currentList.includes(actId)
      ? currentList.filter(id => id !== actId)
      : [...currentList, actId];

    setLogs(prev => {
      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[selectedDateStr];
        return copy;
      }
      return { ...prev, [selectedDateStr]: updated };
    });
  };

  const clearDay = () => {
    setLogs(prev => {
      const copy = { ...prev };
      delete copy[selectedDateStr];
      return copy;
    });
  };

  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-2xl">
        
        {/* Cabecera del Mes y Botón 'Hoy' */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold capitalize tracking-tight text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              {monthName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={goToToday}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Hoy
            </button>
            <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
              <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded-lg text-slate-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded-lg text-slate-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de actividad del mes */}
        <div className="grid grid-cols-3 gap-2 mb-5 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50 text-center">
          <div>
            <span className="text-xs text-slate-400 block">Gym</span>
            <span className="text-sm font-bold text-indigo-400">{stats.gymCount}d</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Práctica</span>
            <span className="text-sm font-bold text-emerald-400">{stats.practiceCount}d</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Partidos</span>
            <span className="text-sm font-bold text-amber-400">{stats.matchCount}d</span>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {DAYS.map((d) => (
            <span key={d} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {d}
            </span>
          ))}
        </div>

        {/* Grilla del Calendario */}
        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-11 rounded-xl bg-slate-950/20" />
          ))}

          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayActivities = logs[dateStr] || [];
            const isSelected = dateStr === selectedDateStr;
            const isToday = todayStr === dateStr;

            return (
              <motion.button
                key={dateStr}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all border ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-500/15 ring-1 ring-indigo-500/50' 
                    : isToday
                    ? 'border-slate-600 bg-slate-800 text-white font-bold'
                    : 'border-slate-800/60 bg-slate-800/20 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <span className={`text-xs ${isSelected ? 'text-indigo-400 font-bold' : ''}`}>
                  {dayNum}
                </span>

                {dayActivities.length > 0 && (
                  <EmojiCarousel activities={dayActivities} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Panel Inferior */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 capitalize">
              {formattedSelectedDate}
            </h2>
            {(logs[selectedDateStr] || []).length > 0 && (
              <button
                onClick={clearDay}
                className="text-xs text-rose-400/80 hover:text-rose-400 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {ACTIVITIES.map((act) => {
              const isActive = (logs[selectedDateStr] || []).includes(act.id);
              const Icon = act.icon;

              return (
                <button
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isActive 
                      ? `${act.color} font-medium` 
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{act.emoji}</span>
                    <span className="text-xs sm:text-sm">{act.label}</span>
                  </div>
                  <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}