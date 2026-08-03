import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Calendar as CalendarIcon, Trophy, Clock, Tag, LogIn, LogOut, ChevronLeft, ChevronRight, Flame, BarChart3, Settings, Edit3 } from 'lucide-react';

// Actividades por defecto
const DEFAULT_SPORTS = [
  { id: 'Partido', label: 'Partido', emoji: '⚽', color: 'emerald' },
  { id: 'Práctica', label: 'Práctica', emoji: '🎯', color: 'cyan' },
  { id: 'Gimnasio', label: 'Gimnasio', emoji: '🏋️‍♂️', color: 'purple' },
  { id: 'Running', label: 'Running', emoji: '🏃‍♂️', color: 'amber' },
  { id: 'Natación', label: 'Natación', emoji: '🏊‍♂️', color: 'blue' },
  { id: 'Otro', label: 'Otro', emoji: '🔥', color: 'slate' }
];

const COLOR_MAP = {
  emerald: { dayBg: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30', badge: 'bg-emerald-950 text-emerald-400 border-emerald-800/50', btn: 'bg-emerald-600' },
  cyan: { dayBg: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30', badge: 'bg-cyan-950 text-cyan-400 border-cyan-800/50', btn: 'bg-cyan-600' },
  purple: { dayBg: 'bg-purple-950/60 text-purple-300 border border-purple-500/30', badge: 'bg-purple-950 text-purple-400 border-purple-800/50', btn: 'bg-purple-600' },
  amber: { dayBg: 'bg-amber-950/60 text-amber-300 border border-amber-500/30', badge: 'bg-amber-950 text-amber-400 border-amber-800/50', btn: 'bg-amber-600' },
  blue: { dayBg: 'bg-blue-950/60 text-blue-300 border border-blue-500/30', badge: 'bg-blue-950 text-blue-400 border-blue-800/50', btn: 'bg-blue-600' },
  rose: { dayBg: 'bg-rose-950/60 text-rose-300 border border-rose-500/30', badge: 'bg-rose-950 text-rose-400 border-rose-800/50', btn: 'bg-rose-600' },
  indigo: { dayBg: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30', badge: 'bg-indigo-950 text-indigo-400 border-indigo-800/50', btn: 'bg-indigo-600' },
  slate: { dayBg: 'bg-slate-800/60 text-slate-300 border border-slate-700/40', badge: 'bg-slate-900 text-slate-400 border-slate-700/50', btn: 'bg-slate-600' }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [events, setEvents] = useState([]);
  
  // Lista de actividades personalizables (guardadas en localStorage)
  const [customSports, setCustomSports] = useState(() => {
    const saved = localStorage.getItem('custom_sports');
    return saved ? JSON.parse(saved) : DEFAULT_SPORTS;
  });

  // Control de vistas
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'stats' | 'settings'

  // Fechas y Calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Formulario Evento
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [sportId, setSportId] = useState(customSports[0]?.id || 'Partido');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Formulario Nueva/Editar Actividad
  const [newSportLabel, setNewSportLabel] = useState('');
  const [newSportEmoji, setNewSportEmoji] = useState('⚽');
  const [newSportColor, setNewSportColor] = useState('emerald');
  const [editingSportId, setEditingSportId] = useState(null);

  // Guardar actividades en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem('custom_sports', JSON.stringify(customSports));
  }, [customSports]);

  // 1. Autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Escuchar Firestore por usuario
  useEffect(() => {
    if (!user) {
      setEvents([]);
      return;
    }
    const q = query(collection(db, 'events'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(docs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  // CONFIRMACIÓN: Cerrar sesión
  const handleLogout = async () => {
    const confirmed = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!confirmed) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const selectedSportObj = customSports.find(s => s.id === sportId) || customSports[0];
    const eventTitle = title.trim() || selectedSportObj.label;

    try {
      await addDoc(collection(db, 'events'), {
        userId: user.uid,
        title: eventTitle,
        date: selectedDateStr,
        time: time || '12:00',
        sport: selectedSportObj.id,
        notes,
        createdAt: new Date().toISOString()
      });

      setTitle('');
      setTime('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error("Error guardando evento:", error);
    }
  };

  // CONFIRMACIÓN: Eliminar un evento
  const handleDelete = async (id, eventTitle) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el evento "${eventTitle || 'seleccionado'}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error("Error borrando evento:", error);
    }
  };

  // Guardar / Editar Actividad Personalizada
  const handleSaveSport = (e) => {
    e.preventDefault();
    if (!newSportLabel.trim()) return;

    if (editingSportId) {
      setCustomSports(prev => prev.map(s => s.id === editingSportId ? { ...s, label: newSportLabel, emoji: newSportEmoji, color: newSportColor } : s));
      setEditingSportId(null);
    } else {
      const id = newSportLabel.toLowerCase().replace(/\s+/g, '-');
      setCustomSports(prev => [...prev, { id, label: newSportLabel, emoji: newSportEmoji, color: newSportColor }]);
    }

    setNewSportLabel('');
    setNewSportEmoji('⚽');
    setNewSportColor('emerald');
  };

  const handleEditSportClick = (sport) => {
    setEditingSportId(sport.id);
    setNewSportLabel(sport.label);
    setNewSportEmoji(sport.emoji);
    setNewSportColor(sport.color);
  };

  // CONFIRMACIÓN: Eliminar una actividad
  const handleDeleteSport = (sport) => {
    if (customSports.length <= 1) {
      alert("Debes tener al menos una actividad registrada.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la actividad "${sport.label}"?\n\n(Los eventos ya guardados mantendrán sus registros pero ya no podrás elegir esta actividad para nuevos eventos).`
    );
    if (!confirmed) return;

    setCustomSports(prev => prev.filter(s => s.id !== sport.id));
    if (sportId === sport.id) {
      const remaining = customSports.filter(s => s.id !== sport.id);
      if (remaining.length > 0) setSportId(remaining[0].id);
    }
  };

  // Cálculo de Rachas
  const uniqueDatesWithEvents = Array.from(new Set(events.map(e => e.date))).sort().reverse();
  
  const calculateStreak = () => {
    if (uniqueDatesWithEvents.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);

    const todayStr = checkDate.toISOString().split('T')[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];

    const hasToday = uniqueDatesWithEvents.includes(todayStr);
    const hasYesterday = uniqueDatesWithEvents.includes(yesterdayStr);

    if (!hasToday && !hasYesterday) return 0;

    let curr = hasToday ? new Date(today) : checkDate;

    while (true) {
      const dateStr = curr.toISOString().split('T')[0];
      if (uniqueDatesWithEvents.includes(dateStr)) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDayString = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Cargando Sport Calendar...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Sport Calendar</h1>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowForm(!showForm); setActiveTab('calendar'); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-indigo-600/30"
                aria-label="Agregar evento"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 p-2 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!user ? (
          /* Pantalla de Bienvenida */
          <div className="text-center py-16 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-6 mt-6">
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">¡Bienvenido a tu Sport Calendar!</h2>
              <p className="text-sm text-slate-400">
                Inicia sesión para sincronizar tus partidos y hábitos deportivos en tu cuenta de Google.
              </p>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Continuar con Google
            </button>
          </div>
        ) : (
          <>
            {/* Pestañas de Navegación */}
            {activeTab === 'calendar' && (
              <>
                {/* Banner de Racha Rápida */}
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg">
                      <Flame className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Racha Actual</p>
                      <p className="text-sm font-bold text-amber-300">{currentStreak} {currentStreak === 1 ? 'Día' : 'Días seguidos'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('stats')} 
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    Ver todo
                  </button>
                </div>

                {/* Calendario */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white capitalize">
                      {monthNames[month]} {year}
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
                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-12" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = formatDayString(dayNum);
                      const isSelected = dateStr === selectedDateStr;
                      const dayEvents = events.filter(e => e.date === dateStr);
                      const hasEvents = dayEvents.length > 0;

                      let dayStyle = "bg-slate-950/40 text-slate-300 hover:bg-slate-800/80 border border-transparent";
                      
                      if (hasEvents) {
                        const firstSportId = dayEvents[0].sport;
                        const sportObj = customSports.find(s => s.id === firstSportId) || customSports[0];
                        const colorCfg = COLOR_MAP[sportObj?.color] || COLOR_MAP.slate;
                        dayStyle = colorCfg.dayBg;
                      }

                      if (isSelected) {
                        dayStyle += " ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 font-bold scale-[1.02]";
                      }

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedDateStr(dateStr)}
                          className={`h-12 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-between p-1.5 relative overflow-hidden ${dayStyle}`}
                        >
                          <span className="leading-none">{dayNum}</span>

                          {hasEvents && (
                            <div className="flex items-center justify-center gap-0.5 text-sm overflow-hidden w-full">
                              {dayEvents.slice(0, 2).map((ev, idx) => {
                                const sportObj = customSports.find(s => s.id === ev.sport);
                                return <span key={idx}>{sportObj?.emoji || '🔥'}</span>;
                              })}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formulario Modal */}
                {showForm && (
                  <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
                    <h2 className="text-lg font-semibold text-white mb-1">
                      Cargar Actividad ({selectedDateStr})
                    </h2>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Selecciona la actividad:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {customSports.map((sport) => {
                          const isSelected = sportId === sport.id;
                          return (
                            <button
                              key={sport.id}
                              type="button"
                              onClick={() => setSportId(sport.id)}
                              className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 font-bold'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span>{sport.emoji}</span>
                              <span>{sport.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Título / Nombre (Opcional)</label>
                      <input
                        type="text"
                        placeholder={`Ej: ${customSports.find(s => s.id === sportId)?.label || 'Partido'}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Hora</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Notas adicionales (Opcional)</label>
                      <textarea
                        placeholder="Lugar, rival, observaciones..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none h-16"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-indigo-600/30"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                )}

                {/* Eventos del día */}
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Eventos para el {selectedDateStr}
                  </h3>

                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                      <p className="text-xs">No hay eventos para este día.</p>
                    </div>
                  ) : (
                    selectedDateEvents.map((event) => {
                      const sportObj = customSports.find(s => s.id === event.sport);
                      const colorCfg = COLOR_MAP[sportObj?.color] || COLOR_MAP.slate;

                      return (
                        <div
                          key={event.id}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-start gap-3"
                        >
                          <div className="space-y-1.5 flex-1">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border inline-flex items-center gap-1 ${colorCfg.badge}`}>
                              <Tag className="w-3 h-3" />
                              {sportObj?.emoji || '🔥'} {sportObj?.label || 'Actividad'}
                            </span>
                            <h4 className="font-semibold text-white text-base">{event.title}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {event.time} hs
                            </p>
                            {event.notes && <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 mt-2">{event.notes}</p>}
                          </div>

                          <button
                            onClick={() => handleDelete(event.id, event.title)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </section>
              </>
            )}

            {/* Pestaña: Estadísticas & Rachas */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-400" />
                  Tus Logros y Estadísticas
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <p className="text-xs text-slate-400">Total de Actividades</p>
                    <p className="text-2xl font-extrabold text-white">{events.length}</p>
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
                    {customSports.map((sport) => {
                      const count = events.filter(e => e.sport === sport.id).length;
                      const percentage = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
                      const colorCfg = COLOR_MAP[sport.color] || COLOR_MAP.slate;

                      return (
                        <div key={sport.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <span>{sport.emoji}</span> {sport.label}
                            </span>
                            <span className="text-slate-400">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${colorCfg.btn}`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña: Configuración / Gestor de Actividades */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-indigo-400" />
                  Personalizar Actividades
                </h2>

                {/* Formulario Crear / Editar Actividad */}
                <form onSubmit={handleSaveSport} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h3 className="text-sm font-semibold text-white">
                    {editingSportId ? 'Editar Actividad' : 'Añadir Nueva Actividad'}
                  </h3>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Pádel, Yoga, Calistenia..."
                      value={newSportLabel}
                      onChange={(e) => setNewSportLabel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Emoji</label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {['⚽', '🎯', '🏋️‍♂️', '🏃‍♂️', '🏊‍♂️', '🎾', '🥊', '🚴‍♂️', '🧘‍♀️', '🏀', '🔥'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewSportEmoji(emoji)}
                          className={`p-2 rounded-lg text-lg border transition-colors ${newSportEmoji === emoji ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-950 border-slate-800'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Color</label>
                    <div className="flex gap-2">
                      {Object.keys(COLOR_MAP).map((colorKey) => (
                        <button
                          key={colorKey}
                          type="button"
                          onClick={() => setNewSportColor(colorKey)}
                          className={`w-8 h-8 rounded-full border-2 ${COLOR_MAP[colorKey].btn} ${newSportColor === colorKey ? 'border-white scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingSportId && (
                      <button
                        type="button"
                        onClick={() => { setEditingSportId(null); setNewSportLabel(''); }}
                        className="bg-slate-800 text-slate-300 py-2 px-4 rounded-lg text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      {editingSportId ? 'Guardar Cambios' : 'Crear Actividad'}
                    </button>
                  </div>
                </form>

                {/* Lista de Actividades Existentes */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-400">Tus Actividades Registradas</h3>
                  {customSports.map((sport) => {
                    const colorCfg = COLOR_MAP[sport.color] || COLOR_MAP.slate;
                    return (
                      <div key={sport.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${colorCfg.badge}`}>
                          <span>{sport.emoji}</span>
                          <span className="font-semibold text-white">{sport.label}</span>
                        </span>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSportClick(sport)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg"
                            title="Editar actividad"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSport(sport)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"
                            title="Eliminar actividad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Barra de Navegación Inferior Sticky */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 z-20">
              <div className="max-w-md mx-auto flex justify-around">
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex flex-col items-center gap-1 p-2 text-xs font-medium ${activeTab === 'calendar' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  Calendario
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex flex-col items-center gap-1 p-2 text-xs font-medium ${activeTab === 'stats' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Rachas
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex flex-col items-center gap-1 p-2 text-xs font-medium ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`}
                >
                  <Settings className="w-5 h-5" />
                  Actividades
                </button>
              </div>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}