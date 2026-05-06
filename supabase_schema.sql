-- 1. Tabela habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  scheduled_time TIME NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name, day_of_week)
);

-- 2. Tabela daily_logs
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- 3. Índices para performance
CREATE INDEX idx_daily_logs_date ON daily_logs(date);
CREATE INDEX idx_daily_logs_habit_date ON daily_logs(habit_id, date);

-- 4. Row Level Security (RLS)
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para 'habits'
CREATE POLICY "Users can create their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para 'daily_logs'
CREATE POLICY "Users can view their own daily logs" ON daily_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = daily_logs.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own daily logs" ON daily_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = daily_logs.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own daily logs" ON daily_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = daily_logs.habit_id
      AND habits.user_id = auth.uid()
    )
  );

-- 5. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
