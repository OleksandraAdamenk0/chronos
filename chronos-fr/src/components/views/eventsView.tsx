import type {EventPreview} from "@/types";
import {useEvent} from "@/hooks/useEvent.ts";
import {useCalendar} from "@/hooks/useCalendar.ts";
import {useEffect, useState} from "react";

interface EventsViewProps {
  onEventClick: (event: EventPreview) => void;
}

const EventsView = ({ onEventClick }: EventsViewProps) => {
  const [events, setEvents] = useState<EventPreview[]>([])
  const {getAll} = useEvent();
  const {getCalendarId} = useCalendar();

  useEffect(() => {
    setEvents(getAll());
  }, [getCalendarId()]);

  console.log(events);
  return (
    <div className="flex flex-col gap-4">
      {events.length > 0 && events.map((event: EventPreview) => (
        <div
          key={event.id}
          className="relative flex justify-start items-center p-2 pl-4 color-primary-foreground cursor-pointer rounded-sm"
          onClick={() => onEventClick(event)}
          style={{

            border: "1px solid var(--card)",
            background: "var(--secondary)",
            overflow: "hidden",
          }}
        >
          <div className="absolute top-0 left-0 w-2 h-full"
               style = {{background: event.color || "none"}}></div>
          <div className="flex flex-col gap-2 items-start">
            <div className="text-md font-semibold leading-tight">{event.title}</div>
            <div className="text-sm leading-tight">{event.startDate.toDateString().split(" ").slice(1).join(" ")}</div>
          </div>

        </div>
      ))}
    </div>
  )
}

export default EventsView;