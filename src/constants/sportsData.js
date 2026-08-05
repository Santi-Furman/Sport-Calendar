// src/constants/sportsData.js

export const DEFAULT_SPORTS = [
  { id: 'gym', label: 'Gimnasio', emoji: '🏋️‍♂️', color: 'bg-orange-500' },
  { id: 'match', label: 'Partido', emoji: '⚽', color: 'bg-green-500' },
  { id: 'running', label: 'Running', emoji: '🏃‍♂️', color: 'bg-blue-500' },
  { id: 'swimming', label: 'Natación', emoji: '🏊‍♂️', color: 'bg-cyan-500' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴‍♂️', color: 'bg-yellow-500' },
  { id: 'rest', label: 'Descanso', emoji: '💤', color: 'bg-purple-500' }
];

export const COLOR_MAP = {
  'bg-orange-500': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', hex: '#f97316' },
  'bg-green-500':  { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', hex: '#22c55e' },
  'bg-blue-500':   { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hex: '#3b82f6' },
  'bg-cyan-500':   { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', hex: '#06b6d4' },
  'bg-yellow-500': { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', hex: '#eab308' },
  'bg-purple-500': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', hex: '#a855f7' },
  'bg-red-500':    { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hex: '#ef4444' },
  'bg-pink-500':   { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', hex: '#ec4899' },
  'bg-indigo-500': { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', hex: '#6366f1' },
  'bg-emerald-500':{ bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', hex: '#10b981' }
};

// Se agregan los colores disponibles extraídos de las llaves del mapa de colores
export const AVAILABLE_COLORS = Object.keys(COLOR_MAP);