import { supabase } from '../lib/supabase';
import { SuperGoal, SuperGoalInsert, SuperGoalUpdate } from '../types/super-goal.types';

export const superGoalsService = {
  async getAllGoals() {
    const { data, error } = await supabase
      .from('super_goals')
      .select('*')
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
};
