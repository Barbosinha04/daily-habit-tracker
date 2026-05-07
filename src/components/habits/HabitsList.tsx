import React from 'react';
import { Habit, DailyLog } from '../../types/habit.types';
import { HabitCard } from './HabitCard';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';

interface HabitsListProps {
  habits: Habit[];
  logs: DailyLog[];
  onToggleLog: (habitId: string, completed: boolean, startTime?: string | null, endTime?: string | null) => void;
  onDeleteHabit: (id: string) => void;
  loading?: boolean;
  isReadOnly?: boolean;
}

export const HabitsList: React.FC<HabitsListProps> = ({
  habits,
  logs,
  onToggleLog,
  onDeleteHabit,
  loading,
  isReadOnly = false,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full animate-pulse bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum hábito agendado para este dia.</p>
        {!isReadOnly && <p className="text-sm">Clique no botão abaixo para adicionar um novo hábito.</p>}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4 -mr-4">
      <div className="flex flex-col gap-3 py-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => {
            const log = logs.find((l) => l.habit_id === habit.id);
            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                log={log}
                isCompleted={!!log?.status_completed}
                onToggle={(completed, startTime, endTime) => onToggleLog(habit.id, completed, startTime, endTime)}
                onDelete={() => onDeleteHabit(habit.id)}
                isReadOnly={isReadOnly}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};
