import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Calendar as CalendarIcon, Trophy, Clock, Tag, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [events, setEvents] = useState([]);
  
  // Estado para el manejo de fechas en el Calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Formulario
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [sport, setSport] = useState('Gimnasio');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // 1. Capturar la redirección de Google + escuchar el estado del usuario
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error al procesar el retorno de Google:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Escuchar eventos de Firestore cuando el usuario está autenticado
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !user) return;

    try {
      await addDoc(collection(db, 'events'), {
        userId: user.uid,
        title,
        date: selectedDateStr,
        time: time || '12:00',
        sport,
        notes,
        createdAt: new Date().toISOString()
      });

      setTitle('');
      setTime('');
      setSport('Gimnasio');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error("Error guardando en la nube:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error("Error borrando en la nube:", error);
    }
  };

  // Lógica para construir la retícula del calendario
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

  // Eventos para la fecha seleccionada actualmente
  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Cargando Sport Calendar...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-10">
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
                onClick={() => setShowForm(!showForm)}
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
                Inicia sesión para sincronizar tus partidos, entrenamientos y eventos en todos tus dispositivos.
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
          /* Vista de Calendario Interactivo */
          <>
            {/* Header del Mes */}
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

              {/* Días de la semana */}
              <div className="grid grid-cols-7 text-center text-xs text-slate-500 font-semibold">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
              </div>

              {/* Retícula del Mes */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Días vacíos de relleno antes del día 1 */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = formatDayString(dayNum);
                  const isSelected = dateStr === selectedDateStr;
                  const hasEvents = events.some(e => e.date === dateStr);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`h-9 rounded-lg text-xs font-medium relative flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/40'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasEvents && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-indigo-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario Modal para la fecha seleccionada */}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Nuevo Evento ({selectedDateStr})
                </h2>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre / Título</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Partido vs Rival, Rutina Piernas"
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
                  <label className="block text-xs font-medium text-slate-400 mb-1">Deporte / Categoría</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Gimnasio">🏋️‍♂️ Gimnasio</option>
                    <option value="Fútbol">⚽ Fútbol</option>
                    <option value="Running">🏃‍♂️ Running</option>
                    <option value="Basquetbol">🏀 Basquetbol</option>
                    <option value="Natación">🏊‍♂️ Natación</option>
                    <option value="Otro">🎯 Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Notas adicionales</label>
                  <textarea
                    placeholder="Detalles, equipamiento, lugar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none h-20"
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

            {/* Eventos del día seleccionado */}
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
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-start gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <span className="bg-indigo-950 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-800/50 inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {event.sport}
                      </span>
                      <h4 className="font-semibold text-white text-base">{event.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {event.time} hs
                      </p>
                      {event.notes && <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 mt-2">{event.notes}</p>}
                    </div>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}