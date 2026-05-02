import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Progresso do dia</span>
        <span className="text-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
