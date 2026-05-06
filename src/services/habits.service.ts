import { supabase } from '../lib/supabase';
import { Habit, HabitInsert, HabitUpdate } from '../types/habit.types';

export const habitsService = {
  async getAllHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getHabitsByDay(day: number) {
    const { data, error } = await supabase
      .from('habits')
      .select('*, daily_logs(*)')
      .eq('day_of_week', day)
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createHabit(habit: HabitInsert) {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateHabit(id: string, habit: HabitUpdate) {
    const { data, error } = await supabase
      .from('habits')
      .update(habit)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteHabit(id: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
