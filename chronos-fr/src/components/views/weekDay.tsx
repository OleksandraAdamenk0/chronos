import React, {useEffect, useRef, useState} from "react";
import type {EventPreview} from "@/types";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

import {useEvent} from "@/hooks/useEvent.ts";
import {ImageDown, Trash2} from "lucide-react";
import {useCalendar} from "@/hooks/useCalendar.ts";
import {toast} from "sonner";
import {DELETE} from "@/utils/api.ts";
import {EventDetails} from "@/components/dialogs/EventDetails.tsx";

interface WeekDayProps {
  day: Date;
  onDayClick: (date: Date) => void;
  onEventClick?: (ev: EventPreview) => void;
}

type PositionedEventType = EventPreview & {
  top: number;
  left: number;
  height: number;
  width: number;
}

const layoutEvents = (events: EventPreview[], hourHeight: number): PositionedEventType[] => {
  const sorted = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const lanes: EventPreview[][] = [];

  sorted.forEach(ev => {
    let placed = false;
    for (const lane of lanes) {
      if (!lane.some(e => {
        const eStart = new Date(e.startDate).getTime();
        const eEnd = new Date(e.endDate).getTime();
        const evStart = new Date(ev.startDate).getTime();
        const evEnd = new Date(ev.endDate).getTime();
        return evStart < eEnd && evEnd > eStart;
      })) {
        lane.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) lanes.push([ev]);
  });

  const eventLayouts: { ev: EventPreview; left: number; width: number }[] = [];

  lanes.forEach((lane) => {
    lane.forEach(ev => {
      const overlappingLanes = lanes.filter(l => l.some(e => {
        const eStart = new Date(e.startDate).getTime();
        const eEnd = new Date(e.endDate).getTime();
        const evStart = new Date(ev.startDate).getTime();
        const evEnd = new Date(ev.endDate).getTime();
        return evStart < eEnd && evEnd > eStart;
      }));
      const width = 100 / overlappingLanes.length;
      const indexInOverlap = overlappingLanes.findIndex(l => l.includes(ev));
      const left = indexInOverlap * width;
      eventLayouts.push({ ev, left, width });
    });
  });

  return eventLayouts.map(({ ev, left, width }) => {
    const start = new Date(ev.startDate);
    const end = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate);
    const startheight = (start.getHours() * 60 + start.getMinutes()) / 60 * hourHeight;
    const duration = (end.getTime() - start.getTime()) / 3600000 * hourHeight || 30;

    return { ...ev, top: startheight, height: duration, left: left, width: width };
  });
};

const WeekDay:React.FC<WeekDayProps> = ({day, onDayClick}: WeekDayProps) => {
  const {getCalendarId, getPermissions} = useCalendar();
  const {deleteEvent} = useEvent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hourHeight, setHourHeight] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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

  const handleDeleteEvent = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, event: PositionedEventType) => {
    e.stopPropagation();
    if (getCalendarId() === "0" || !(getPermissions().manageEvents)) {
      toast.warning("You can't delete events in this calendar");
      return;
    }

    try {
      const result = await DELETE(`calendar/${getCalendarId()}/events/${event.id}`);
      if (!result.success) {
        toast.error("Something went wrong");
        return;
      }
      deleteEvent(event);
      toast.success("Event succesfully deleted!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.error || "Something went wrong");
    }
  }

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
          {layoutEvents(getForDay(day), hourHeight).map((event) => (
            <ContextMenu key={event.id}>
              <ContextMenuTrigger asChild>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventId(event.id);
                    setDetailsOpen(true);
                  }}
                  className="relative flex justify-start items-center p-1 pl-3 color-primary-foreground cursor-pointer rounded-sm"
                  style={{
                    position: "absolute",
                    top: event.top,
                    left: `${event.left}%`,
                    width: `${event.width}%`,
                    height: event.height,
                    border: "1px solid var(--card)",
                    background: "var(--secondary)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: event.height,
                      background: event.color || "none",
                    }}
                  ></div>
                  <div className="text-xs font-semibold leading-tight">{event.title}</div>
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent className="w-40">
                <ContextMenuItem onClick={() => console.log("Edit", event)}>
                  <ImageDown className="mr-2 h-4 w-4" />Change
                </ContextMenuItem>

                <ContextMenuItem onClick={(e) => handleDeleteEvent(e, event)}>
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
      {selectedEventId && (
        <EventDetails
          open={detailsOpen}
          setOpen={setDetailsOpen}
          eventId={selectedEventId}
        />
      )}
    </div>
  );
}

export default WeekDay;