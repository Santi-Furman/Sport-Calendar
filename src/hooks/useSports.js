// src/hooks/useSports.js
import { useState, useEffect } from 'react';
import { DEFAULT_SPORTS } from '../constants/sportsData';

const LOCAL_STORAGE_KEY = 'sport_calendar_custom_sports';

export const useSports = () => {
  const [sports, setSports] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SPORTS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sports));
  }, [sports]);

  const addSport = (newSport) => {
    setSports(prev => [...prev, newSport]);
  };

  const deleteSport = (id) => {
    setSports(prev => prev.filter(sport => sport.id !== id));
  };

  return { sports, addSport, deleteSport };
};