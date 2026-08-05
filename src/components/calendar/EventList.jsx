import React from 'react';
import { Calendar as CalendarIcon, Tag, Clock, Trash2 } from 'lucide-react';
import { COLOR_MAP } from '../../constants/sportsData';

export default function EventList({ selectedDateStr, events, sports, onDeleteEvent }) {
  const dayEvents = events[selectedDateStr] || [];

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
        Eventos para el {selectedDateStr}
      </h3>

      {dayEvents.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-500">
          <CalendarIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
          <p className="text-xs">No hay eventos para este día.</p>
        </div>
      ) : (
        dayEvents.map((event) => {
          const sportObj = sports.find(s => s.id === event.sport);
          const colorCfg = COLOR_MAP[sportObj?.color] || COLOR_MAP['bg-purple-500'];

          return (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-start gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border inline-flex items-center gap-1 ${colorCfg.bg}/20 ${colorCfg.text} ${colorCfg.border}/30`}>
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
                onClick={() => onDeleteEvent(event.id, event.title)}
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
  );
}