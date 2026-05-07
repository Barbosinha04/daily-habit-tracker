import { supabase } from '../lib/supabase';
import { SuperGoal, SuperGoalInsert, SuperGoalUpdate, SuperGoalLogInsert } from '../types/super-goal.types';

export const superGoalsService = {
  async getAllGoals() {
    const { data, error } = await supabase
      .from('super_goals')
      .select('*, super_goal_logs(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createGoal(goal: SuperGoalInsert) {
    const { data, error } = await supabase
      .from('super_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, goal: SuperGoalUpdate) {
    const { data, error } = await supabase
      .from('super_goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('super_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addLog(log: SuperGoalLogInsert) {
    const { error } = await supabase
      .from('super_goal_logs')
      .insert(log);

    if (error) throw error;
  },

  async getLogsByGoalId(goalId: string) {
    const { data, error } = await supabase
      .from('super_goal_logs')
      .select('*')
      .eq('goal_id', goalId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },
};
