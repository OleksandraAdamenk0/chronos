import React from "react";
import MonthView from "@/components/views/monthView.tsx";

interface YearCalendarProps {
  date: Date;
  onDayClick?: (date: Date) => void;
}

const YearView: React.FC<YearCalendarProps> = ({date, onDayClick}) => {
  return (
    <div className="h-full w-full flex justify-center items-start">
      <div className="h-full w-auto grid grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => {
          const monthDate = new Date(date);
          monthDate.setMonth(i);

          return (
            <MonthView
              key={i}
              date={monthDate}
              onDayClick={onDayClick}
            />
          );
        })}
      </div>
    </div>

  )
}

export default YearView;