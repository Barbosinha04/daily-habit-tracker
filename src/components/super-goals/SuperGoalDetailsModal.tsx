import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { SuperGoalWithLogs } from '../../types/super-goal.types';
import { ProgressDonut } from './ProgressDonut';
import { ActivityChart } from './ActivityChart';
import { Badge } from '../ui/badge';
import { Target, TrendingUp, Clock, AlertCircle, Trophy } from 'lucide-react';

import { startOfWeek, addDays, format, parseISO, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SuperGoalDetailsModalProps {
  goal: SuperGoalWithLogs | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SuperGoalDetailsModal: React.FC<SuperGoalDetailsModalProps> = ({
  goal,
  isOpen,
  onClose,
}) => {
  if (!goal) return null;

  const remaining = Math.max(goal.target_count - goal.current_count, 0);

  // Processar dados reais para o gráfico
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Filtra logs, garantindo que lidamos com o formato de data do Supabase (YYYY-MM-DD)
    const dailyLogs = (goal.super_goal_logs || []).filter(log => {
      // Supabase retorna strings para DATE columns. Ex: "2024-05-08"
      const logDate = typeof log.date === 'string' ? log.date.split('T')[0] : log.date;
      return logDate === dateStr;
    });

    const totalChange = dailyLogs.reduce((acc, log) => acc + Number(log.change_amount || 0), 0);

    return {
      name: format(date, 'eee', { locale: ptBR }).replace('.', ''),
      value: Math.max(0, totalChange),
      active: totalChange > 0
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden rounded-[32px] shadow-2xl flex flex-col">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[80px]" />
        </div>

        <DialogHeader className="p-6 pb-2 z-10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 mb-2 uppercase tracking-[0.2em] text-[10px] font-black">
                Detalhes da Supermeta
              </Badge>
              <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                {goal.title}
                {goal.status === 'completed' && <Trophy className="h-5 w-5 text-yellow-500" />}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6 z-10 overflow-y-auto custom-scrollbar">
          {/* Seção Status - Compacta */}
          <div className="bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-800 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 self-start">
              <Target className="h-3 w-3" />
              Status da Meta
            </h3>
            <div className="scale-90 origin-center">
              <ProgressDonut current={goal.current_count} target={goal.target_count} />
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Faltam exatamente</p>
              <p className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                {remaining} execuções
              </p>
            </div>
          </div>

          {/* Gráfico - Compacto */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 ml-1">
              <TrendingUp className="h-3 w-3" />
              Histórico de Execuções
            </h3>
            <ActivityChart data={chartData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
