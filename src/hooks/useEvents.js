// src/hooks/useEvents.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useEvents = (userId) => {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEvents({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsMap = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const dateKey = data.date;
        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        eventsMap[dateKey].push({
          id: docSnap.id,
          ...data
        });
      });

      setEvents(eventsMap);
      setLoading(false);
    }, (error) => {
      console.error("Error al escuchar eventos en Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addEvent = async (eventData) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error agregando evento:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  return { events, loading, addEvent, deleteEvent };
};