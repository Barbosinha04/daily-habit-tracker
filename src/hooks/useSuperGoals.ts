import { useState, useEffect, useCallback } from 'react';
import { superGoalsService } from '../services/super-goals.service';
import { SuperGoal, SuperGoalInsert, SuperGoalUpdate } from '../types/super-goal.types';
import { supabase } from '../lib/supabase';
import { isBefore, startOfDay, parseISO } from 'date-fns';

export function useSuperGoals() {
  const [goals, setGoals] = useState<SuperGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await superGoalsService.getAllGoals();
      
      // Lógica de atualização de status baseada no prazo
      const today = startOfDay(new Date());
      const updatedGoals = await Promise.all(data.map(async (goal) => {
        const endDate = startOfDay(parseISO(goal.end_date));
        let newStatus = goal.status;

        if (goal.status === 'active' && isBefore(endDate, today)) {
          newStatus = goal.current_count >= goal.target_count ? 'completed' : 'failed';
          const updated = await superGoalsService.updateGoal(goal.id, { status: newStatus });
          return updated;
        }
        return goal;
      }));

      setGoals(updatedGoals);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (newGoal: Omit<SuperGoalInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const data = await superGoalsService.createGoal({
        ...newGoal,
        user_id: user.id,
      });
      setGoals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateGoalCount = async (id: string, increment: boolean) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || goal.status !== 'active') return;

    const newCount = increment 
      ? Math.min(goal.current_count + 1, goal.target_count)
      : Math.max(goal.current_count - 1, 0);
    
    if (newCount === goal.current_count) return;

    // Optimistic Update
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current_count: newCount } : g));

    try {
      let status = goal.status;
      if (newCount >= goal.target_count) {
        status = 'completed';
      }

      await superGoalsService.updateGoal(id, { current_count: newCount, status });
    } catch (err) {
      fetchGoals(); // Rollback on error
      setError(err as Error);
      throw err;
    }
  };

  const removeGoal = async (id: string) => {
    try {
      await superGoalsService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { goals, loading, error, addGoal, updateGoalCount, removeGoal, refresh: fetchGoals };
}
