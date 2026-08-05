import React, { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { COLOR_MAP } from '../../constants/sportsData';

export default function CustomSportsManager({ sports, onAddSport, onDeleteSport }) {
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('⚽');
  const [color, setColor] = useState('bg-green-500');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    const id = label.toLowerCase().replace(/\s+/g, '-');
    onAddSport({ id, label, emoji, color });
    setLabel('');
  };

  const handleDelete = (sport) => {
    if (sports.length <= 1) {
      alert("Debes tener al menos una actividad registrada.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${sport.label}"?\n\nLos eventos ya guardados mantendrán sus registros.`
    );
    if (!confirmed) return;
    onDeleteSport(sport.id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-400" />
        Personalizar Actividades
      </h2>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-white">Añadir Nueva Actividad</h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Nombre</label>
          <input
            type="text"
            required
            placeholder="Ej: Pádel, Yoga..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Emoji</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['⚽', '🎯', '🏋️‍♂️', '🏃‍♂️', '🏊‍♂️', '🎾', '🥊', '🚴‍♂️', '🧘‍♀️', '🏀', '🔥'].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`p-2 rounded-lg text-lg border ${emoji === e ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-950 border-slate-800'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Color</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(COLOR_MAP).map((colorKey) => (
              <button
                key={colorKey}
                type="button"
                onClick={() => setColor(colorKey)}
                className={`w-8 h-8 rounded-full border-2 ${COLOR_MAP[colorKey].bg} ${color === colorKey ? 'border-white scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Crear Actividad
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-400">Tus Actividades Registradas</h3>
        {sports.map((sport) => {
          const colorCfg = COLOR_MAP[sport.color] || COLOR_MAP['bg-purple-500'];
          return (
            <div key={sport.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${colorCfg.bg}/20 ${colorCfg.text} ${colorCfg.border}/30`}>
                <span>{sport.emoji}</span>
                <span className="font-semibold text-white">{sport.label}</span>
              </span>

              <button
                onClick={() => handleDelete(sport)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg"
                title="Eliminar actividad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}