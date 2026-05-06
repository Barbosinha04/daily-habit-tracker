import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { DayTabs } from './components/habits/DayTabs';
import { HabitsList } from './components/habits/HabitsList';
import { AddHabitForm } from './components/habits/AddHabitForm';
import { SuperGoalsList } from './components/super-goals/SuperGoalsList';
import { AddSuperGoalForm } from './components/super-goals/AddSuperGoalForm';
import { Auth } from './components/Auth';
import { useHabits } from './hooks/useHabits';
import { useDailyLogs } from './hooks/useDailyLogs';
import { useSuperGoals } from './hooks/useSuperGoals';
import { useRealtimeSubscription } from './hooks/useRealtimeSubscription';
import { Progress } from './components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { LightningBoltIcon } from '@radix-ui/react-icons';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { migrateFromLocalStorage } from './utils/migration.helpers';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { supabase } from './lib/supabase';
import { User, LogOut, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ListTodo, Target } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Calendar } from './components/ui/calendar';
import { isDateInPast, isDateToday, formatToISO } from './utils/date.helpers';
import { ptBR } from 'date-fns/locale';
import { format, addDays, subDays } from 'date-fns';

const HabitTracker = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'super'>('daily');
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  
  // Usar data real ao invés de apenas o index do dia
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (day && day.includes('-')) {
      return new Date(day + 'T12:00:00');
    }
    return new Date();
  });

  const dateStr = formatToISO(selectedDate);
  const currentDayIndex = selectedDate.getDay();
  const isPast = isDateInPast(selectedDate);
  const isToday = isDateToday(selectedDate);
  const isReadOnly = isPast;
  
  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const { habits, loading: habitsLoading, addHabit, removeHabit, refresh: refreshHabits } = useHabits(currentDayIndex);
  const { logs, loading: logsLoading, toggleLog, refresh: refreshLogs } = useDailyLogs(selectedDate);
  const { goals, loading: goalsLoading, addGoal, updateGoalCount, removeGoal, refresh: refreshGoals } = useSuperGoals();

  useRealtimeSubscription('habits', refreshHabits);
  useRealtimeSubscription('daily_logs', refreshLogs);
  useRealtimeSubscription('super_goals', refreshGoals);

  const completedCount = habits.filter(h => logs.find(l => l.habit_id === h.id)?.status_completed).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    navigate(`/habits/${formatToISO(date)}`);
    setActiveTab('daily');
  };

  const handlePrevDay = () => handleDateChange(subDays(selectedDate, 1));
  const handleNextDay = () => handleDateChange(addDays(selectedDate, 1));
  const handleGoToToday = () => handleDateChange(new Date());

  const [hasLocalData, setHasLocalData] = useState(false);
  useEffect(() => {
    const localHabits = localStorage.getItem('habits');
    if (localHabits) setHasLocalData(true);
  }, []);

  const handleMigration = async () => {
    try {
      const result = await migrateFromLocalStorage();
      toast.success(`Migração concluída: ${result.migrated} hábitos migrados.`);
      setHasLocalData(false);
      refreshHabits();
    } catch (error) {
      toast.error('Erro na migração de dados.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 text-foreground flex flex-col items-center py-8 px-4 selection:bg-primary/30">
      <Card className="w-full max-w-4xl shadow-2xl border-zinc-800 bg-zinc-900/40 backdrop-blur-xl">
        {!isConfigured && (
          <div className="bg-destructive/15 border-b border-destructive/20 p-4 text-destructive text-sm text-center font-medium animate-pulse">
            ⚠️ Supabase não configurado! Edite o arquivo <strong>.env</strong> para conectar ao banco de dados.
          </div>
        )}
        <CardHeader className="space-y-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-xl shadow-primary/20 rotate-3">
                <LightningBoltIcon className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tighter">HABIT TRACKER</CardTitle>
                <CardDescription className="text-zinc-400 font-medium">Sua rotina, elevada ao próximo nível.</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasLocalData && (
                <Button variant="outline" size="sm" onClick={handleMigration} className="border-zinc-700">
                  Migrar Local
                </Button>
              )}
              <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700/50 shadow-inner">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-300 max-w-[120px] truncate uppercase tracking-widest">
                  {user.email.split('@')[0]}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={handleSignOut}>
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-zinc-800/50 rounded-2xl">
              <TabsTrigger value="daily" className="rounded-xl text-sm font-bold gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:shadow-lg">
                <ListTodo className="h-4 w-4" />
                Rotina Diária
              </TabsTrigger>
              <TabsTrigger value="super" className="rounded-xl text-sm font-bold gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:shadow-lg">
                <Target className="h-4 w-4" />
                Supermetas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold tracking-tight">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-[0.2em]">
                    {isReadOnly ? 'Progresso Histórico' : 'Progresso de Hoje'}
                  </span>
                  <span className="text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-zinc-800" indicatorClassName="bg-gradient-to-r from-primary to-primary/60" />
              </div>

              <div className="flex items-center justify-between gap-3 bg-zinc-800/30 p-3 rounded-2xl border border-zinc-700/30">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-zinc-800" onClick={handlePrevDay}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex flex-col items-center min-w-[140px]">
                    <span className="text-[10px] uppercase font-black text-primary/80 tracking-widest leading-none mb-1">
                      {format(selectedDate, 'EEEE', { locale: ptBR })}
                    </span>
                    <span className="text-base font-bold text-white leading-none">
                      {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl hover:bg-zinc-800" 
                    onClick={handleNextDay}
                    disabled={isToday}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {!isToday && (
                    <Button variant="outline" size="sm" className="h-9 rounded-xl border-zinc-700 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800" onClick={handleGoToToday}>
                      Hoje
                    </Button>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-zinc-700 hover:bg-zinc-800">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 rounded-2xl" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && handleDateChange(date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        locale={ptBR}
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DayTabs 
                currentDayIndex={currentDayIndex} 
                selectedDate={selectedDate} 
                onDateChange={handleDateChange} 
              />

              <HabitsList
                habits={habits}
                logs={logs}
                onToggleLog={toggleLog}
                onDeleteHabit={removeHabit}
                loading={habitsLoading || logsLoading}
                isReadOnly={isReadOnly}
              />
              
              {!isReadOnly && <AddHabitForm onAdd={addHabit} currentDay={currentDayIndex} />}
            </TabsContent>

            <TabsContent value="super" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/30">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Foco de Longo Prazo
                </h3>
                <p className="text-sm text-zinc-400">
                  Defina metas maiores que exigem consistência por vários dias ou semanas.
                </p>
              </div>

              <SuperGoalsList
                goals={goals}
                onUpdateCount={updateGoalCount}
                onDelete={removeGoal}
                loading={goalsLoading}
              />

              <AddSuperGoalForm onAdd={addGoal} />
            </TabsContent>
          </Tabs>
        </CardHeader>

        <footer className="p-8 pt-0 text-center">
          <Separator className="bg-zinc-800 mb-8" />
          <p className="text-[12px] text-zinc-500 font-bold uppercase tracking-[0.3em] opacity-50">
            "Nós somos o que repetidamente fazemos." — Aristóteles
          </p>
        </footer>
      </Card>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="dark min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <Routes>
      <Route 
        path="/habits/:day" 
        element={user ? <HabitTracker user={user} /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/auth" 
        element={!user ? <Auth /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={`/habits/${new Date().getDay()}`} replace />} 
      />
    </Routes>
  );
}

export default App;
