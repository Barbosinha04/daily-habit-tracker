import { Database } from './database.types';

export type SuperGoal = Database['public']['Tables']['super_goals']['Row'];
export type SuperGoalInsert = Database['public']['Tables']['super_goals']['Insert'];
export type SuperGoalUpdate = Database['public']['Tables']['super_goals']['Update'];
