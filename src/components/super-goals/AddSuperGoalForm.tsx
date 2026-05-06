import React, { useState } from 'react';
import { SuperGoalInsert } from '../../types/super-goal.types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Plus, Target, CalendarDays, Hash, Sparkles } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface AddSuperGoalFormProps {
  onAdd: (goal: Omit<SuperGoalInsert, 'user_id'>) => Promise<void>;
}

export const AddSuperGoalForm: React.FC<AddSuperGoalFormProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetCount, setTargetCount] = useState('30');
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetCount || !endDate) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        target_count: parseInt(targetCount),
        end_date: endDate,
        current_count: 0,
        status: 'active',
        start_date: format(new Date(), 'yyyy-MM-dd'),
      });
      setTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to add super goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20" size="lg">
          <Sparkles className="h-5 w-5" />
          Nova Supermeta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Criar Supermeta
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Defina um objetivo de longo prazo e acompanhe sua evolução até o sucesso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 text-zinc-300">
              Título do Objetivo
            </Label>
            <Input
              id="title"
              placeholder="Ex: Shape em 60 Dias, Estudar 100h de Rust..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-zinc-800/50 border-zinc-700 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="flex items-center gap-2 text-zinc-300">
                <Hash className="h-4 w-4" />
                Alvo (Execuções)
              </Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-2 text-zinc-300">
                <CalendarDays className="h-4 w-4" />
                Data Final
              </Label>
              <Input
                id="end_date"
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="bg-zinc-800/50 border-zinc-700 focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-lg font-bold shadow-xl shadow-primary/10">
              {isSubmitting ? 'Criando...' : 'Lançar Supermeta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
