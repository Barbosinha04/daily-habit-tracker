-- Tabela super_goals
CREATE TABLE super_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  target_count INTEGER NOT NULL CHECK (target_count > 0),
  current_count INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_super_goals_user_id ON super_goals(user_id);
CREATE INDEX idx_super_goals_status ON super_goals(status);

-- RLS
ALTER TABLE super_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own super goals" ON super_goals
  FOR ALL USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_super_goals_updated_at
    BEFORE UPDATE ON super_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
