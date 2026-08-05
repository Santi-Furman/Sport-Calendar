// src/components/settings/CustomSportsManager.jsx
import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { COLOR_MAP, AVAILABLE_COLORS } from '../../constants/sportsData';

export default function CustomSportsManager({
  isOpen,
  onClose,
  sports,
  onAddSport,
  onUpdateSport,
  onDeleteSport
}) {
  const [editingId, setEditingId] = useState(null);
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('🏃');
  const [color, setColor] = useState('bg-indigo-500');

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setLabel('');
    setEmoji('🏃');
    setColor('bg-indigo-500');
  };

  const handleStartEdit = (sport) => {
    setEditingId(sport.id);
    setLabel(sport.label);
    setEmoji(sport.emoji);
    setColor(sport.color);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    if (editingId) {
      onUpdateSport({
        id: editingId,
        label: label.trim(),
        emoji,
        color
      });
    } else {
      onAddSport({
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label: label.trim(),
        emoji,
        color
      });
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-white">Gestionar Categorías</h3>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario Crear / Editar Categoría */}
        <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 mb-5 space-y-3">
          <p className="text-xs font-semibold text-indigo-400">
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-12 bg-slate-900 border border-slate-800 rounded-lg text-center text-lg py-1.5 text-white focus:outline-none focus:border-indigo-500"
              maxLength={2}
              required
            />
            <input
              type="text"
              placeholder="Nombre (ej. Gimnasio)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Selector de Color */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Color distintivo</label>
            <div className="flex gap-1.5 flex-wrap">
              {AVAILABLE_COLORS.map((c) => {
                const cfg = COLOR_MAP[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform ${cfg.bg} ${c === color ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                  >
                    {c === color && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 transition-colors"
            >
              {editingId ? 'Actualizar' : <><Plus className="w-3.5 h-3.5" /> Crear</>}
            </button>
          </div>
        </form>

        {/* Lista de Categorías Existentes */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-slate-400">Categorías configuradas</p>
          {sports.map((s) => {
            const colorCfg = COLOR_MAP[s.color] || COLOR_MAP['bg-purple-500'];
            return (
              <div
                key={s.id}
                className="bg-slate-950 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg text-sm bg-slate-900 border ${colorCfg.border}`}>
                    {s.emoji}
                  </span>
                  <span className="text-sm text-slate-200 font-medium">{s.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(s)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                    title="Editar categoría"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSport(s.id)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}