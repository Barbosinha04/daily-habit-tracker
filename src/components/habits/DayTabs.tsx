import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { getWeekDays, isDateToday, formatToISO } from '../../utils/date.helpers';

interface DayTabsProps {
  currentDayIndex: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DayTabs: React.FC<DayTabsProps> = ({ currentDayIndex, selectedDate, onDateChange }) => {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="w-full">
      <Tabs 
        value={formatToISO(selectedDate)} 
        onValueChange={(val) => onDateChange(new Date(val + 'T12:00:00'))}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          {weekDays.map((day) => {
            const isToday = isDateToday(day.date);
            return (
              <TabsTrigger
                key={formatToISO(day.date)}
                value={formatToISO(day.date)}
                className={`flex flex-col gap-1 py-2 transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-sm ${
                  isToday ? 'border-b-2 border-primary ring-1 ring-primary/20' : ''
                }`}
              >
                <span className={`text-[10px] uppercase font-bold ${
                  isToday ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {day.dayName.slice(0, 3)}
                </span>
                <span className={`text-sm font-medium ${isToday ? 'text-primary font-bold' : ''}`}>
                  {day.date.getDate()}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
