import { useState, useEffect, useCallback } from 'react';
import { habitsService } from '../services/habits.service';
import { Habit, HabitInsert } from '../types/habit.types';
import { supabase } from '../lib/supabase';

export function useHabits(day?: number) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = day !== undefined 
        ? await habitsService.getHabitsByDay(day)
        : await habitsService.getAllHabits();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (newHabit: Omit<HabitInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const data = await habitsService.createHabit({
        ...newHabit,
        user_id: user.id,
      });
      setHabits(prev => [...prev, data].sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time)));
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const removeHabit = async (id: string) => {
    const previousHabits = [...habits];
    setHabits(prev => prev.filter(h => h.id !== id));
    try {
      await habitsService.deleteHabit(id);
    } catch (err) {
      setHabits(previousHabits);
      setError(err as Error);
      throw err;
    }
  };

  return { habits, loading, error, addHabit, removeHabit, refresh: fetchHabits };
}
