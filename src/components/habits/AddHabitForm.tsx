import React, { useState } from 'react';
import { HabitInsert } from '../../types/habit.types';
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
import { Plus, Clock, ListTodo } from 'lucide-react';
import { toast } from 'sonner';

interface AddHabitFormProps {
  onAdd: (habit: Omit<HabitInsert, 'user_id'>) => Promise<void>;
  currentDay: number;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAdd, currentDay }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        scheduled_time: `${time}:00`,
        day_of_week: currentDay,
      });
      setName('');
      setOpen(false);
      toast.success('Hábito adicionado com sucesso!');
    } catch (error: any) {
      console.error('Failed to add habit:', error);
      toast.error(error.message || 'Erro ao adicionar hábito. Verifique se as tabelas existem no Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Novo Hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Hábito</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do hábito que você deseja rastrear neste dia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Nome do Hábito
            </Label>
            <Input
              id="name"
              placeholder="Ex: Beber água, Meditar..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário Agendado
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adicionando...' : 'Criar Hábito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
