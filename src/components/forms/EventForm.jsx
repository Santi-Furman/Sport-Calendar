import React, { useState } from 'react';

export default function EventForm({ selectedDateStr, sports, onSubmit, onClose }) {
  const [sportId, setSportId] = useState(sports[0]?.id || '');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSportObj = sports.find(s => s.id === sportId) || sports[0];
    const eventTitle = title.trim() || selectedSportObj.label;

    onSubmit({
      title: eventTitle,
      date: selectedDateStr,
      time: time || '12:00',
      sport: selectedSportObj.id,
      notes
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-1">
        Cargar Actividad ({selectedDateStr})
      </h2>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Selecciona la actividad:</label>
        <div className="grid grid-cols-3 gap-2">
          {sports.map((sport) => (
            <button
              key={sport.id}
              type="button"
              onClick={() => setSportId(sport.id)}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-all ${
                sportId === sport.id
                  ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <span>{sport.emoji}</span>
              <span>{sport.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Título / Nombre (Opcional)</label>
        <input
          type="text"
          placeholder={`Ej: ${sports.find(s => s.id === sportId)?.label || 'Partido'}`}
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
          onClick={onClose}
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
  );
}