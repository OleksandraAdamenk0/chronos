import React, {useMemo} from "react";
import WeekDay from "@/components/views/weekDay.tsx";
import type {EventPreview} from "@/types";
import {useCalendar} from "@/hooks/useCalendar.ts";

type WeekViewProps = {
  onDayClick: (date: Date) => void;
  onEventClick?: (ev: EventPreview) => void;
  className?: string;
};

const WeekView:React.FC<WeekViewProps> = ({onDayClick, onEventClick, className = ""}: WeekViewProps) => {
  const {startDay, getStartWeek} = useCalendar();

  // create array of 7 days, each at local midnight
  const days = useMemo(() => {
    const startDate = getStartWeek();
    const base = new Date(startDate);
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [startDay]);


  const getKeyForDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  return (
    <div className={`w-full overflow-auto ${className} h-full`}>
        <div className="grid grid-cols-7 gap-2 h-full">
          {days.map((day) => {
            const key = getKeyForDate(day);
            return <WeekDay key={key} day={day} onDayClick={onDayClick} onEventClick={onEventClick} />
          })}
        </div>
    </div>
  );
}

export default WeekView;