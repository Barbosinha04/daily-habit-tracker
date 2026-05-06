import { format, startOfWeek, addDays, isBefore, startOfDay, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getDayName = (dayIndex: number) => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[dayIndex];
};

export const getCurrentDateStr = () => format(new Date(), 'yyyy-MM-dd');

export const isDateInPast = (date: Date | string) => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(startOfDay(targetDate), startOfDay(new Date()));
};

export const isDateToday = (date: Date | string) => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  return isToday(targetDate);
};

export const formatToISO = (date: Date) => format(date, 'yyyy-MM-dd');

export const getWeekDays = (baseDate: Date = new Date()) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Start on Monday
  return Array.from({ length: 6 }).map((_, i) => {
    const date = addDays(start, i);
    return {
      date,
      dayName: format(date, 'EEEE', { locale: ptBR }),
      dayIndex: date.getDay(),
    };
  });
};
