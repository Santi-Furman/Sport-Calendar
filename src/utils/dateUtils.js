// src/utils/dateUtils.js

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Retorna la cantidad de días de un mes y el día de la semana en que comienza (0=Dom).
 */
export const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  const firstDayIndex = date.getDay();
  
  // Días del mes actual
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let i = 1; i <= lastDay; i++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      dayNumber: i,
      dateString: formattedDate
    });
  }
  
  return { days, firstDayIndex };
};

export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};