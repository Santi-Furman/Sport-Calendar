import React, { useState } from 'react';
import { Trophy, LogIn } from 'lucide-react';

// Hooks personalizados
import { useAuth } from './hooks/useAuth';
import { useSports } from './hooks/useSports';
import { useEvents } from './hooks/useEvents';

// Utilidades
import { calculateStreak } from './utils/streakUtils';
import { getTodayString } from './utils/dateUtils';

// Componentes
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import CalendarGrid from './components/calendar/CalendarGrid';
import EventList from './components/calendar/EventList';
import EventForm from './components/forms/EventForm';
import StatsDashboard from './components/stats/StatsDashboard';
import CustomSportsManager from './components/settings/CustomSportsManager';

export default function App() {
  const { user, loading: loadingAuth, loginWithGoogle, logout } = useAuth();
  const { sports, addSport, deleteSport } = useSports();
  const { events, addEvent, deleteEvent } = useEvents(user?.uid);

  const [activeTab, setActiveTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(getTodayString());
  const [showForm, setShowForm] = useState(false);

  const currentStreak = calculateStreak(events);

  const handleLogoutConfirm = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
    }
  };

  const handleDeleteEventConfirm = (id, eventTitle) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${eventTitle || 'seleccionado'}"?`)) {
      deleteEvent(id);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Cargando Sport Calendar...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header
        user={user}
        onOpenForm={() => { setShowForm(!showForm); setActiveTab('calendar'); }}
        onLogout={handleLogoutConfirm}
      />

      <main className="max-w-md mx-auto p-4 space-y-6">
        {!user ? (
          <div className="text-center py-16 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-6 mt-6">
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">¡Bienvenido a tu Sport Calendar!</h2>
              <p className="text-sm text-slate-400">
                Inicia sesión para sincronizar tus partidos y hábitos deportivos en tu cuenta de Google.
              </p>
            </div>
            <button
              onClick={loginWithGoogle}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Continuar con Google
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'calendar' && (
              <>
                <CalendarGrid
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  selectedDateStr={selectedDateStr}
                  setSelectedDateStr={setSelectedDateStr}
                  events={events}
                  sports={sports}
                  currentStreak={currentStreak}
                  onGoToStats={() => setActiveTab('stats')}
                />

                {showForm && (
                  <EventForm
                    selectedDateStr={selectedDateStr}
                    sports={sports}
                    onSubmit={addEvent}
                    onClose={() => setShowForm(false)}
                  />
                )}

                <EventList
                  selectedDateStr={selectedDateStr}
                  events={events}
                  sports={sports}
                  onDeleteEvent={handleDeleteEventConfirm}
                />
              </>
            )}

            {activeTab === 'stats' && (
              <StatsDashboard
                eventsMap={events}
                sports={sports}
                currentStreak={currentStreak}
              />
            )}

            {activeTab === 'settings' && (
              <CustomSportsManager
                sports={sports}
                onAddSport={addSport}
                onDeleteSport={deleteSport}
              />
            )}

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        )}
      </main>
    </div>
  );
}