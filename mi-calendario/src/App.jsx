import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Activity, 
  Trophy, 
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';

// Categorías de actividades con emojis y colores
const ACTIVITIES = [
  { id: 'gym', label: 'Gimnasio', emoji: '🏋️‍♂️', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Dumbbell },
  { id: 'practice', label: 'Práctica', emoji: '⚽', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Activity },
  { id: 'match', label: 'Partido', emoji: '🏆', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Trophy },
];

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Componente para el carrusel de emojis en cada día
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
    <div className="relative h-7 w-7 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${activities[index]}-${index}`}
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.7 }}
          transition={{ duration: 0.25 }}
          className="text-lg select-none absolute"
        >
          {currentAct?.emoji}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  
  // Persistencia local en el navegador
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('sports_calendar_logs');
    return saved ? JSON.parse(saved) : {
      [new Date().toISOString().split('T')[0]]: ['gym', 'match']
    };
  });

  useEffect(() => {
    localStorage.setItem('sports_calendar_logs', JSON.stringify(logs));
  }, [logs]);

  // Navegación de mes
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Cálculo de días del mes actual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Ajuste para comenzar el lunes (0 = Lunes, 6 = Domingo)
  let startingDayIndex = firstDayOfMonth.getDay() - 1;
  if (startingDayIndex === -1) startingDayIndex = 6;

  const totalDays = lastDayOfMonth.getDate();

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Toggle de actividad
  const toggleActivity = (actId) => {
    const currentList = logs[selectedDateStr] || [];
    let updated;
    if (currentList.includes(actId)) {
      updated = currentList.filter(id => id !== actId);
    } else {
      updated = [...currentList, actId];
    }

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

  // Formato para el título de la fecha seleccionada
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Cabecera del Mes */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold capitalize tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            {monthName}
          </h1>
          <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {DAYS.map((d) => (
            <span key={d} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {d}
            </span>
          ))}
        </div>

        {/* Grilla del Calendario */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Espacios vacíos antes del primer día */}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 rounded-xl bg-slate-950/20" />
          ))}

          {/* Días del mes */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayActivities = logs[dateStr] || [];
            const isSelected = dateStr === selectedDateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <motion.button
                key={dateStr}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`h-12 rounded-2xl flex flex-col items-center justify-center relative transition-all border ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50' 
                    : isToday
                    ? 'border-slate-700 bg-slate-800/80 text-white'
                    : 'border-slate-800/60 bg-slate-800/20 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <span className={`text-xs font-medium ${isSelected ? 'text-indigo-400 font-bold' : ''}`}>
                  {dayNum}
                </span>

                {/* Carrusel de Emojis dentro de la casilla */}
                {dayActivities.length > 0 && (
                  <div className="mt-0.5">
                    <EmojiCarousel activities={dayActivities} />
                  </div>
                )}

                {/* Indicador de más de 1 actividad (puntos) */}
                {dayActivities.length > 1 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayActivities.map((_, idx) => (
                      <span key={idx} className="w-1 h-1 rounded-full bg-indigo-400/80" />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Panel Inferior: Actividades del Día Seleccionado */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 capitalize">
              {formattedSelectedDate}
            </h2>
            {(logs[selectedDateStr] || []).length > 0 && (
              <button
                onClick={clearDay}
                className="text-xs text-rose-400/80 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Limpiar
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
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isActive 
                      ? `${act.color} font-medium` 
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{act.emoji}</span>
                    <span className="text-sm">{act.label}</span>
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