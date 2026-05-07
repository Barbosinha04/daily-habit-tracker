import React from 'react';
import { Habit } from '../../types/habit.types';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Trash2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  isReadOnly?: boolean;
}

export const HabitCard = React.forwardRef<HTMLDivElement, HabitCardProps>(({
  habit,
  isCompleted,
  onToggle,
  onDelete,
  isReadOnly = false,
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={isReadOnly ? {} : { scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`overflow-hidden transition-all duration-300 ${
          isReadOnly ? 'opacity-60 cursor-not-allowed grayscale-[0.3]' : 'bg-card'
        } ${isCompleted ? 'bg-muted/50 border-primary/20' : ''}`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isReadOnly && !isCompleted ? (
              <XCircle className="h-6 w-6 text-destructive/70" />
            ) : (
              <Checkbox
                id={`habit-${habit.id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => onToggle(!!checked)}
                className="h-6 w-6"
                disabled={isReadOnly}
              />
            )}
            <div className="flex flex-col">
              <label
                htmlFor={`habit-${habit.id}`}
                className={`font-medium text-lg transition-all ${
                  isReadOnly ? '' : 'cursor-pointer'
                } ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {habit.name}
              </label>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{habit.scheduled_time.slice(0, 5)}</span>
              </div>
            </div>
          </div>
          
          {!isReadOnly && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
