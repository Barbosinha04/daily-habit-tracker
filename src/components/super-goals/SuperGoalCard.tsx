import React, { useState } from 'react';
import { SuperGoal, SuperGoalWithLogs } from '../../types/super-goal.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Minus, Calendar, Trophy, AlertCircle, Trash2, Maximize2 } from 'lucide-react';
import { formatDistanceToNow, parseISO, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { SuperGoalDetailsModal } from './SuperGoalDetailsModal';

interface SuperGoalCardProps {
  goal: SuperGoalWithLogs;
  onUpdateCount: (id: string, increment: boolean) => void;
  onDelete: (id: string) => void;
}

export const SuperGoalCard = React.forwardRef<HTMLDivElement, SuperGoalCardProps>(({ goal, onUpdateCount, onDelete }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const progress = (goal.current_count / goal.target_count) * 100;
  const isCompleted = goal.status === 'completed' || progress >= 100;
  const isInactive = goal.status !== 'active';

  const timeRemaining = formatDistanceToNow(parseISO(goal.end_date), { locale: ptBR, addSuffix: true });

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className={`overflow-hidden group transition-all duration-300 ${isInactive ? 'opacity-70 grayscale-[0.2]' : 'hover:shadow-2xl hover:border-primary/40'} bg-zinc-900/40 border-zinc-800`}>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {goal.title}
                {goal.status === 'completed' && <Trophy className="h-4 w-4 text-yellow-500" />}
                {goal.status === 'failed' && <AlertCircle className="h-4 w-4 text-destructive" />}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Prazo: {timeRemaining}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(goal.id)}
                className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className={isCompleted ? 'text-green-500' : 'text-primary'}>
                  {Math.round(progress)}% concluído
                </span>
                <span className="text-muted-foreground">
                  {goal.current_count} / {goal.target_count} execuções
                </span>
              </div>
              <Progress 
                value={progress} 
                className={`h-2.5 transition-all duration-500 ${isCompleted ? 'bg-green-500/20' : 'bg-zinc-800'}`} 
                indicatorClassName={isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                disabled={isInactive || goal.current_count <= 0}
                onClick={() => onUpdateCount(goal.id, false)}
                className="h-10 w-10 rounded-full border-zinc-800 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Minus className="h-5 w-5" />
              </Button>

              <div className="text-2xl font-black min-w-[3rem] text-center">
                {goal.current_count}
              </div>

              <Button
                variant="outline"
                size="icon"
                disabled={isInactive || goal.current_count >= goal.target_count}
                onClick={() => onUpdateCount(goal.id, true)}
                className="h-10 w-10 rounded-full border-zinc-800 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <SuperGoalDetailsModal
        goal={goal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});
