import { useState, useEffect, useCallback, useRef } from 'react';
import { superGoalsService } from '../services/super-goals.service';
import { SuperGoal, SuperGoalInsert, SuperGoalUpdate, SuperGoalWithLogs } from '../types/super-goal.types';
import { supabase } from '../lib/supabase';
import { isBefore, startOfDay, parseISO, format } from 'date-fns';

export function useSuperGoals() {
  const [goals, setGoals] = useState<SuperGoalWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fila de atualizações para evitar condições de corrida (Race Conditions)
  const pendingUpdates = useRef<Record<string, Promise<any>>>({});
  // Timestamp da última atualização para evitar que o realtime sobrescreva o estado otimista
  const lastUpdateRef = useRef<number>(0);

  const fetchGoals = useCallback(async (silent = false, force = false) => {
    // Se for um fetch silencioso e não for forçado, aplica o throttle de 2s
    if (silent && !force && Date.now() - lastUpdateRef.current < 2000) {
      return;
    }

    try {
      if (!silent) setLoading(true);
      const data = await superGoalsService.getAllGoals();
      
      // Lógica de atualização de status baseada no prazo
      const today = startOfDay(new Date());
      const updatedGoals = await Promise.all(data.map(async (goal) => {
        const endDate = startOfDay(parseISO(goal.end_date));
        let newStatus = goal.status;

        if (goal.status === 'active' && isBefore(endDate, today)) {
          newStatus = goal.current_count >= goal.target_count ? 'completed' : 'failed';
          const updated = await superGoalsService.updateGoal(goal.id, { status: newStatus });
          return { ...updated, super_goal_logs: goal.super_goal_logs };
        }
        return goal as SuperGoalWithLogs;
      }));

      setGoals(updatedGoals);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err as Error);
    } finally {
      if (!silent) setLoading(false);
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
      const goalWithEmptyLogs: SuperGoalWithLogs = { ...data, super_goal_logs: [] };
      setGoals(prev => [goalWithEmptyLogs, ...prev]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateGoalCount = async (id: string, increment: boolean) => {
    const change = increment ? 1 : -1;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    // Encontrar o objetivo atual para cálculos
    const goal = goals.find(g => g.id === id);
    if (!goal || goal.status !== 'active') return;

    const newCount = Math.max(0, Math.min(goal.current_count + change, goal.target_count));
    if (newCount === goal.current_count) return;

    lastUpdateRef.current = Date.now();

    // 1. Atualização Otimista Imediata
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g, 
          current_count: newCount,
          status: newCount >= g.target_count ? 'completed' : g.status,
          super_goal_logs: [...g.super_goal_logs, {
            id: 'temp-' + Date.now(),
            goal_id: id,
            user_id: g.user_id,
            date: todayStr,
            change_amount: change,
            created_at: new Date().toISOString()
          } as any]
        };
      }
      return g;
    }));

    // 2. Encadear na fila de promessas para este ID específico
    const currentPromise = (async () => {
      try {
        await pendingUpdates.current[id];

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 3. Persistir no Banco (Log primeiro, depois Meta)
        await superGoalsService.addLog({
          goal_id: id,
          user_id: user.id,
          change_amount: change,
          date: todayStr
        });

        await superGoalsService.updateGoal(id, { 
          current_count: newCount, 
          status: newCount >= goal.target_count ? 'completed' : 'active'
        });
        
        // 4. Sincronização silenciosa FORÇADA
        await fetchGoals(true, true);
      } catch (err) {
        console.error('Error in sequential update:', err);
        await fetchGoals(false, true); 
        setError(err as Error);
      }
    })();

    pendingUpdates.current[id] = currentPromise;
    return currentPromise;
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
