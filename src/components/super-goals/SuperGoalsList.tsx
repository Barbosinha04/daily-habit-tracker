import React from 'react';
import { SuperGoal } from '../../types/super-goal.types';
import { SuperGoalCard } from './SuperGoalCard';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';

interface SuperGoalsListProps {
  goals: SuperGoal[];
  onUpdateCount: (id: string, increment: boolean) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const SuperGoalsList: React.FC<SuperGoalsListProps> = ({
  goals,
  onUpdateCount,
  onDelete,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 w-full animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
        <p className="text-lg font-medium">Nenhuma supermeta ativa.</p>
        <p className="text-sm">Defina um grande objetivo para manter o foco!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4 -mr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <SuperGoalCard
              key={goal.id}
              goal={goal}
              onUpdateCount={onUpdateCount}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};
