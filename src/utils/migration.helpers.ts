import { habitsService } from '../services/habits.service';
import { dailyLogsService } from '../services/daily-logs.service';
import { supabase } from '../lib/supabase';

export const migrateFromLocalStorage = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const localHabits = localStorage.getItem('habits');
  const localLogs = localStorage.getItem('daily_logs');

  if (!localHabits) return { migrated: 0, errors: 0 };

  const habits = JSON.parse(localHabits);
  const logs = localLogs ? JSON.parse(localLogs) : [];

  let migratedCount = 0;
  let errorCount = 0;

  for (const h of habits) {
    try {
      // Create habit in Supabase
      const newHabit = await habitsService.createHabit({
        name: h.name,
        scheduled_time: h.scheduled_time || '08:00:00',
        day_of_week: h.day_of_week || 0,
        user_id: user.id,
      });

      // Migrating logs for this habit
      const habitLogs = logs.filter((l: any) => l.habit_id === h.id);
      for (const log of habitLogs) {
        await dailyLogsService.upsertLog({
          habit_id: newHabit.id,
          date: log.date,
          status_completed: log.completed,
        });
      }
      migratedCount++;
    } catch (err) {
      console.error('Error migrating habit:', h.name, err);
      errorCount++;
    }
  }

  // Clear local storage after migration
  if (errorCount === 0) {
    localStorage.removeItem('habits');
    localStorage.removeItem('daily_logs');
  }

  return { migrated: migratedCount, errors: errorCount };
};
