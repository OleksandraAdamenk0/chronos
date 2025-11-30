import type {EventPreview} from "@/types";
import {useEvent} from "@/hooks/useEvent.ts";
import {useCalendar} from "@/hooks/useCalendar.ts";
import {useEffect, useMemo, useState} from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface EventsViewProps {
  onEventClick: (event: EventPreview) => void;
}

const PER_PAGE = 11;

const EventsView = ({ onEventClick }: EventsViewProps) => {
  const [events, setEvents] = useState<EventPreview[]>([]);
  const [page, setPage] = useState(1);

  const {getAll} = useEvent();
  const {getCalendarId} = useCalendar();

  useEffect(() => {
    const all = getAll();
    setEvents(all);
    setPage(1); // сброс страницы при переключении календаря
  }, [getCalendarId()]);

  const totalPages = Math.ceil(events.length / PER_PAGE);

  // события текущей страницы
  const currentEvents = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return events.slice(start, start + PER_PAGE);
  }, [page, events]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">

      {/* --- EVENTS LIST --- */}
      {currentEvents.map((event: EventPreview) => (
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
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ background: event.color || "none" }}
          ></div>

          <div className="flex flex-col gap-2 items-start">
            <div className="text-md font-semibold leading-tight">
              {event.title}
            </div>
            <div className="text-sm leading-tight">
              {event.startDate.toDateString().split(" ").slice(1).join(" ")}
            </div>
          </div>
        </div>
      ))}

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>

            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Ellipsis if too many pages */}
            {totalPages > 7 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default EventsView;
