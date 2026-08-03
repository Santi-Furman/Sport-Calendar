import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Trophy, Clock, Tag } from 'lucide-react';

export default function App() {
  // 1. Cargar eventos guardados de localStorage al iniciar la app
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('sport_calendar_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
    // Evento inicial de demostración si no hay nada guardado aún
    return [
      {
        id: '1',
        title: 'Entrenamiento de Fútbol',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        sport: 'Fútbol',
        notes: 'Llevar calzado adecuado y botella de agua'
      }
    ];
  });

  // Estado del formulario para crear eventos
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sport, setSport] = useState('Gimnasio');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // 2. Guardar automáticamente en localStorage cada vez que cambia la lista de 'events'
  useEffect(() => {
    localStorage.setItem('sport_calendar_events', JSON.stringify(events));
  }, [events]);

  // Manejar creación de evento
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
      time: time || '12:00',
      sport,
      notes
    };

    setEvents([newEvent, ...events]);

    // Limpiar formulario
    setTitle('');
    setDate('');
    setTime('');
    setSport('Gimnasio');
    setNotes('');
    setShowForm(false);
  };

  // Manejar eliminación de evento
  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-10">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Sport Calendar</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-indigo-600/30"
            aria-label="Agregar evento"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Formulario Modal / Colapsable */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2">Nuevo Evento Deportivo</h2>
            
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
              <label className="block text-xs font-medium text-slate-400 mb-1">Notas adicionales (opcional)</label>
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

        {/* Lista de Eventos */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Próximos Eventos</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 text-slate-500">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tienes eventos agendados.</p>
              <p className="text-xs text-slate-600">Presiona el botón + para agregar uno.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm flex justify-between items-start gap-3"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-950 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-800/50 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {event.sport}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-base leading-snug">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {event.time} hs
                    </span>
                  </div>

                  {event.notes && (
                    <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 mt-2">
                      {event.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  title="Eliminar evento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}