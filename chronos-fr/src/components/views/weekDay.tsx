import React, {useEffect, useRef, useState} from "react";
import type {EventPreview} from "@/types";

import {useEvent} from "@/hooks/useEvent.ts";

interface WeekDayProps {
  day: Date;
  onDayClick: (date: Date) => void;
  onEventClick?: (ev: EventPreview) => void;
}

const WeekDay:React.FC<WeekDayProps> = ({day, onDayClick}: WeekDayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hourHeight, setHourHeight] = useState(0);

  const {getForDay} = useEvent();

  useEffect(() => {
    const calcHeight = () => {
      if (containerRef.current) {
        const fullHeight = containerRef.current.clientHeight;
        setHourHeight(fullHeight / 24);
      }
    };
    calcHeight();
    window.addEventListener("resize", calcHeight);
    return () => window.removeEventListener("resize", calcHeight);
  }, []);

  return (
    <div className="flex flex-col bg-card rounded-md border border-border flex-1 overflow-hidden">

      {/* header of day */}
      <button
        type="button"
        className="text-sm text-muted-foreground text-left p-2 border-b"
      >
        <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {day.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
          <span className="text-xs text-muted-foreground">
                      {day.getDate()}
                    </span>
        </div>
      </button>

      {/* TIME GRID + EVENTS */}
      <div  ref={containerRef} className="flex-1 relative overflow-auto"
            onClick={(e) => {
              if (!containerRef.current) return;

              const rect = containerRef.current.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const hour = Math.floor(y / hourHeight);
              const minutes = Math.floor(((y % hourHeight) / hourHeight) * 60);

              const clickedDate = new Date(day);
              clickedDate.setHours(hour);
              clickedDate.setMinutes(minutes);
              clickedDate.setSeconds(0);

              onDayClick(clickedDate);
            }}
      >

        {/* grid of hours */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(24, ${hourHeight}px)`,
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-border text-[10px] text-muted-foreground pl-1 flex items-start"
            >
              {i}:00
            </div>
          ))}
        </div>

        {/* positioned events */}
        <div className="absolute inset-0">
          {getForDay(day).map(ev => {
            const start = new Date(ev.startDate);
            const end = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate);
            if (end.getDate() > day.getDate()) {
              end.setDate(start.getDate());
              end.setHours(23);
              end.setMinutes(59);
            }
            const startheight = (start.getHours() * 60 + start.getMinutes()) / 60 * hourHeight;
            const duration = (end.getTime() - start.getTime()) / 3600000 * hourHeight  || 30;

            return (
              <div
                key={ev.id}
                className="relative flex justify-start items-center p-1 pl-3 color-primary-foreground cursor-pointer rounded-sm"
                // onClick={() => onEventClick?.(ev)}
                style={{
                  position: "absolute",
                  top: startheight,
                  left: "4px",
                  right: "4px",
                  height: duration,
                  border: "1px solid var(--card)",
                  background: "var(--secondary)",
                  overflow: "hidden",
                }}
              >
                <div className="absolute"
                     style = {{
                       top: "0px",
                       left: "0px",
                       width: "4px",
                       height: duration,
                       background: ev.color || "none"
                     }}></div>
                <div className="text-xs font-semibold leading-tight">{ev.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeekDay;