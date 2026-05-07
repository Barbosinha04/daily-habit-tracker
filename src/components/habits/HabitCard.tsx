import React, { useState, useEffect } from 'react';
import { Habit, DailyLog } from '../../types/habit.types';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface HabitCardProps {
  habit: Habit;
  log?: DailyLog;
  isCompleted: boolean;
  onToggle: (completed: boolean, startTime?: string | null, endTime?: string | null) => void;
  onDelete: () => void;
  isReadOnly?: boolean;
}

export const HabitCard = React.forwardRef<HTMLDivElement, HabitCardProps>(({
  habit,
  log,
  isCompleted,
  onToggle,
  onDelete,
  isReadOnly = false,
}, ref) => {
  const [showTimeFields, setShowTimeFields] = useState(false);
  const [startTime, setStartTime] = useState(log?.start_time || '');
  const [endTime, setEndTime] = useState(log?.end_time || '');

  // Sincronizar estado local com log quando o log mudar (ex: após fetch)
  useEffect(() => {
    if (log?.start_time) setStartTime(log.start_time);
    if (log?.end_time) setEndTime(log.end_time);
  }, [log]);

  const handleToggle = (checked: boolean) => {
    if (checked && endTime && startTime && endTime < startTime) {
      toast.error('A hora de término não pode ser anterior à hora de início.');
      return;
    }
    onToggle(checked, startTime || null, endTime || null);
  };

  const handleTimeChange = () => {
    if (isCompleted) {
      if (endTime && startTime && endTime < startTime) {
        toast.error('A hora de término não pode ser anterior à hora de início.');
        return;
      }
      onToggle(true, startTime || null, endTime || null);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={isReadOnly ? {} : { scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`overflow-hidden transition-all duration-300 border-zinc-800/50 ${
          isReadOnly ? 'opacity-60 cursor-not-allowed grayscale-[0.3]' : 'bg-zinc-900/40 backdrop-blur-sm'
        } ${isCompleted ? 'bg-zinc-800/40 border-primary/20 shadow-inner' : 'hover:border-zinc-700/50'}`}
      >
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isReadOnly && !isCompleted ? (
                <XCircle className="h-6 w-6 text-destructive/70" />
              ) : (
                <Checkbox
                  id={`habit-${habit.id}`}
                  checked={isCompleted}
                  onCheckedChange={(checked) => handleToggle(!!checked)}
                  className="h-6 w-6 rounded-md border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  disabled={isReadOnly}
                />
              )}
              <div className="flex flex-col">
                <label
                  htmlFor={`habit-${habit.id}`}
                  className={`font-bold text-lg transition-all ${
                    isReadOnly ? '' : 'cursor-pointer'
                  } ${
                    isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100'
                  }`}
                >
                  {habit.name}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Clock className="h-3 w-3" />
                    <span>Agendado: {habit.scheduled_time.slice(0, 5)}</span>
                  </div>
                  {(startTime || endTime) && (
                    <div className="flex items-center gap-1 text-xs text-primary/80 font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                      <span>{startTime || '--:--'}</span>
                      {endTime && <span> → {endTime}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTimeFields(!showTimeFields)}
                  className={`h-8 w-8 rounded-lg transition-colors ${showTimeFields ? 'bg-zinc-800 text-primary' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  {showTimeFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
              {!isReadOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 rounded-lg text-zinc-500 hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showTimeFields && !isReadOnly && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-zinc-800/50 pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`start-${habit.id}`} className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Início
                    </Label>
                    <Input
                      id={`start-${habit.id}`}
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      onBlur={handleTimeChange}
                      className="h-9 bg-zinc-950/50 border-zinc-800 text-sm focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`end-${habit.id}`} className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Término (Opcional)
                    </Label>
                    <Input
                      id={`end-${habit.id}`}
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      onBlur={handleTimeChange}
                      className="h-9 bg-zinc-950/50 border-zinc-800 text-sm focus:ring-primary/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});
