// src/utils/streakUtils.js

/**
 * Calcula la racha actual de días consecutivos con actividad física.
 * Ignora los días categorizados como 'descanso' o excluidos.
 */
export const calculateStreak = (eventsMap) => {
  const dates = Object.keys(eventsMap).sort();
  if (dates.length === 0) return 0;

  // Filtrar días que tienen al menos un evento que NO sea descanso
  const activeDates = dates.filter(dateStr => {
    const dayEvents = eventsMap[dateStr] || [];
    return dayEvents.some(evt => evt.sportId !== 'rest');
  });

  if (activeDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Si no hay actividad hoy ni ayer, la racha actual es 0
  if (!activeDates.includes(todayStr) && !activeDates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date();

  // Si hoy no se ha entrenado aún pero ayer sí, empezamos a contar desde ayer
  if (!activeDates.includes(todayStr) && activeDates.includes(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (activeDates.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};