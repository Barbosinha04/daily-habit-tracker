import { supabase } from '../lib/supabase';
import { DailyLogInsert, DailyLogUpdate } from '../types/habit.types';

export const dailyLogsService = {
  async getLogsByDate(date: string) {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return data;
  },

  async upsertLog(log: DailyLogInsert) {
    const { data, error } = await supabase
      .from('daily_logs')
      .upsert(log, { onConflict: 'habit_id, date' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLog(id: string, log: DailyLogUpdate) {
    const { data, error } = await supabase
      .from('daily_logs')
      .update(log)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
