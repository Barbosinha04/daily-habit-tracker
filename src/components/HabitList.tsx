import { Habit } from '../types/habit';
import { TrashIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Sua jornada começa aqui. Adicione seu primeiro hábito!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <Card
          key={habit.id}
          className={cn(
            "group flex items-center justify-between p-4 transition-colors hover:bg-accent/50",
            habit.completedToday && "bg-muted/30"
          )}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={habit.completedToday}
              onCheckedChange={() => onToggle(habit.id)}
              id={`habit-${habit.id}`}
            />
            <label
              htmlFor={`habit-${habit.id}`}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer select-none transition-all",
                habit.completedToday ? "text-muted-foreground line-through" : "text-foreground"
              )}
            >
              {habit.name}
            </label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(habit.id)}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
