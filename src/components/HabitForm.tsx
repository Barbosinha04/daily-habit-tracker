import { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HabitFormProps {
  onAdd: (name: string) => void;
}

export function HabitForm({ onAdd }: HabitFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="O que vamos focar hoje?"
        className="flex-1"
      />
      <Button type="submit" size="sm" className="gap-1">
        <PlusIcon className="h-4 w-4" />
        Adicionar
      </Button>
    </form>
  );
}
