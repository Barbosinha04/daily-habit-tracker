import { useState, useEffect, useCallback } from 'react';
import { dailyLogsService } from '../services/daily-logs.service';
import { DailyLog } from '../types/habit.types';
import { format, parseISO } from 'date-fns';

export function useDailyLogs(date: Date = new Date()) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const dateStr = format(date, 'yyyy-MM-dd');

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dailyLogsService.getLogsByDate(dateStr);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleLog = async (habitId: string, completed: boolean, start_time?: string | null, end_time?: string | null) => {
    const previousLogs = [...logs];
    const existingLog = logs.find(l => l.habit_id === habitId);
    const completed_at = completed ? new Date().toISOString() : null;
    
    // Optimistic Update
    if (existingLog) {
      setLogs(prev => prev.map(l => 
        l.habit_id === habitId 
          ? { 
              ...l, 
              status_completed: completed, 
              completed_at,
              start_time: start_time ?? l.start_time,
              end_time: end_time ?? l.end_time
            } 
          : l
      ));
    } else {
      setLogs(prev => [...prev, {
        id: 'temp',
        habit_id: habitId,
        date: dateStr,
        status_completed: completed,
        completed_at,
        start_time: start_time ?? null,
        end_time: end_time ?? null,
        created_at: new Date().toISOString()
      } as DailyLog]);
    }

    try {
      const updatedLog = await dailyLogsService.upsertLog({
        habit_id: habitId,
        date: dateStr,
        status_completed: completed,
        completed_at,
        start_time: start_time ?? existingLog?.start_time ?? null,
        end_time: end_time ?? existingLog?.end_time ?? null,
      });
      setLogs(prev => prev.map(l => l.habit_id === habitId ? updatedLog : l));
    } catch (err) {
      setLogs(previousLogs);
      setError(err as Error);
      throw err;
    }
  };

  return { logs, loading, error, toggleLog, refresh: fetchLogs };
}
