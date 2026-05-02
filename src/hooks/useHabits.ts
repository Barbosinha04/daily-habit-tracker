import { useState, useEffect } from 'react';
import { Habit } from '../types/habit';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('daily-habits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('daily-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completedToday: false,
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const progress = habits.length > 0 
    ? (habits.filter(h => h.completedToday).length / habits.length) * 100 
    : 0;

  return { habits, addHabit, toggleHabit, deleteHabit, progress };
}
