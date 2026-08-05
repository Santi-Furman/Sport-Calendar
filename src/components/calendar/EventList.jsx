// src/components/calendar/EventList.jsx
import React from 'react';
import { Plus, Trash2, Edit2, Clock, FileText } from 'lucide-react';
import { COLOR_MAP } from '../../constants/sportsData';

export default function EventList({
  selectedDateStr,
  events,
  sports,
  onOpenForm,
  onEditEvent,
  onDeleteEvent
}) {
  const dayEvents = events[selectedDateStr] || [];

  const getSportInfo = (sportKey) => {
    return sports.find(s => s.id === sportKey || s.label?.toLowerCase() === sportKey?.toLowerCase()) || {
      label: 'Actividad',
      emoji: '🏆',
      color: 'bg-purple-500'
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-300">Actividades Registradas</h3>
          <p className="text-xs text-slate-500">{selectedDateStr}</p>
        </div>
        <button
          onClick={() => onOpenForm()}
          className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500">No hay actividades registradas en esta fecha</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((ev) => {
            const sportKey = ev.sport || ev.sportId;
            const sportInfo = getSportInfo(sportKey);
            const colorCfg = COLOR_MAP[sportInfo.color] || COLOR_MAP['bg-purple-500'];

            return (
              <div
                key={ev.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`text-xl p-2 rounded-xl bg-slate-900 border ${colorCfg.border}`}>
                    {sportInfo.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{sportInfo.label}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {ev.duration} min
                      </span>
                      {ev.notes && (
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <FileText className="w-3 h-3 text-slate-500" />
                          {ev.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditEvent(ev)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                    title="Editar actividad"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Eliminar actividad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}