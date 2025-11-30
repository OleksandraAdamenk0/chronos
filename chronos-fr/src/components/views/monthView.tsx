import React from "react";
import {useEvent} from "@/hooks/useEvent.ts";

interface MonthCalendarProps {
  type?: string;
  date: Date;
  onDayClick?: (date: Date) => void;
}

const MonthView: React.FC<MonthCalendarProps> = ({date, onDayClick, type="small"}) => {
  const {getForDay} = useEvent();

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  for (let i = 0; i < (startWeekday === 0 ? 6 : startWeekday - 1); i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  console.log(date);

  return (
    <div className="h-full flex justify-center items-start">
      <div className={`h-full ${type==="full"? "aspect-square": ""} max-w-fit rounded-md border border-border bg-card p-4`}>
        <div className="grid grid-cols-7 text-center text-muted-foreground text-sm mb-6">
          {weekDays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className="h-auto grid grid-cols-7 gap-3">
          {weeks.map((week, i) =>
            week.map((day, j) => {
              if (day === null) {
                return <div key={`${i}-${j}`} className="aspect-square h-fit"></div>;
              }

              const newDate = new Date(date.getFullYear(), date.getMonth(), day);
              const eventExists = getForDay(newDate).length > 0;

              return (
                <button
                  key={`${i}-${j}`}
                  onClick={() => onDayClick?.(newDate)}
                  className={`
                  aspect-square flex items-center justify-center text-sm rounded-full
                  transition-colors border
                  ${eventExists
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                  }
                `}
                >
                  {day}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
