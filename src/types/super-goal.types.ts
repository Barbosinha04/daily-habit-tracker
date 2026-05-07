import { Database } from './database.types';

export type SuperGoal = Database['public']['Tables']['super_goals']['Row'];
export type SuperGoalInsert = Database['public']['Tables']['super_goals']['Insert'];
export type SuperGoalUpdate = Database['public']['Tables']['super_goals']['Update'];

export type SuperGoalLog = Database['public']['Tables']['super_goal_logs']['Row'];
export type SuperGoalLogInsert = Database['public']['Tables']['super_goal_logs']['Insert'];

export interface SuperGoalWithLogs extends SuperGoal {
  super_goal_logs: SuperGoalLog[];
}
