import React from 'react';
import { Trophy, Plus, LogOut } from 'lucide-react';

export default function Header({ user, onOpenForm, onLogout }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Sport Calendar</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenForm}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-indigo-600/30"
              aria-label="Agregar evento"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-red-400 p-2 rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}