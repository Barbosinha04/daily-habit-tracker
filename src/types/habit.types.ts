import { Database } from './database.types';

export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitInsert = Database['public']['Tables']['habits']['Insert'];
export type HabitUpdate = Database['public']['Tables']['habits']['Update'];

export type DailyLog = Database['public']['Tables']['daily_logs']['Row'];
export type DailyLogInsert = Database['public']['Tables']['daily_logs']['Insert'];
export type DailyLogUpdate = Database['public']['Tables']['daily_logs']['Update'];

export interface HabitWithLogs extends Habit {
  daily_logs: DailyLog[];
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;
