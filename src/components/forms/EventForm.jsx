// src/components/forms/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Clock, FileText, Activity } from 'lucide-react';

export default function EventForm({
  isOpen,
  onClose,
  onSubmit,
  sports = [],
  initialData = null // Si viene un objeto, está Editando. Si es null, creando.
}) {
  const [sport, setSport] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setSport(initialData.sport || initialData.sportId || sports[0]?.id || '');
      setDuration(initialData.duration || 30);
      setNotes(initialData.notes || '');
    } else {
      setSport(sports[0]?.id || '');
      setDuration(30);
      setNotes('');
    }
  }, [initialData, sports, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sport) return;

    onSubmit({
      sport,
      duration: Number(duration),
      notes,
      ...(initialData ? { id: initialData.id } : {})
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-white">
            {initialData ? 'Editar Actividad Registrada' : 'Registrar Actividad'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Categoría</label>
            <div className="relative">
              <Activity className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Duración (minutos)</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Notas (Opcional)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                placeholder="Ej. Buenas sensaciones en el entrenamiento..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              {initialData ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}