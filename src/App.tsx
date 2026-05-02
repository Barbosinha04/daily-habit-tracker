import { HabitForm } from './components/HabitForm';
import { HabitList } from './components/HabitList';
import { ProgressBar } from './components/ProgressBar';
import { useHabits } from './hooks/useHabits';
import { LightningBoltIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function App() {
  const { habits, addHabit, toggleHabit, deleteHabit, progress } = useHabits();

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-muted/40">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
              <LightningBoltIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Daily Habits</CardTitle>
              <CardDescription className="text-muted-foreground">
                Consistência é a chave para o sucesso.
              </CardDescription>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </CardHeader>
        
        <CardContent className="space-y-8">
          <HabitForm onAdd={addHabit} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                Seus Hábitos
              </h3>
              <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded-full border border-muted-foreground/10 text-muted-foreground">
                {habits.length} TOTAL
              </span>
            </div>
            
            <Separator className="bg-muted/50" />
            
            <HabitList 
              habits={habits} 
              onToggle={toggleHabit} 
              onDelete={deleteHabit} 
            />
          </div>
        </CardContent>

        <footer className="p-6 pt-0 text-center">
          <p className="text-[11px] text-muted-foreground/60 font-medium">
            "Nós somos o que repetidamente fazemos." — Aristóteles
          </p>
        </footer>
      </Card>
    </div>
  );
}

export default App;
