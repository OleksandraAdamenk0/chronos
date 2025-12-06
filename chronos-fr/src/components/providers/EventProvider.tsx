import React, {type ReactNode, useEffect, useState} from "react";
import type {EventPreview, RepeatType} from "@/types";

import {EventContext} from "@/contexts/EventContext.tsx";

import {useCalendar} from "@/hooks/useCalendar.ts";
import {useUser} from "@/hooks/useUser.ts";
import {getCountryCodeByName} from "@/utils/country.ts";
import {GET} from "@/utils/api.ts";

interface Props {
  children: ReactNode;
}

type EventFromServerType = {
  id: string;
  calendarId: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  isRepeat: boolean;
  startRepeatDate?: string;
  endRepeatDate?: string;
  period: RepeatType;
}

const EventProvider: React.FC<Props> = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Record<string, EventPreview[]>>({})
  const {getUser} = useUser();
  const {getCalendarId, startDay} = useCalendar();
  const prevStartDayRef = React.useRef<Date | null>(startDay);

  useEffect(() => {
    console.log("this log is needed to render event provider. I don't know why and i don't give a fuck");
  }, []);

  // default calendar events
  useEffect(() => {
    const user = getUser();
    console.log(user);

    if (user && user.country) {
      getCountryCodeByName(user.country)
        .then(code => {
          console.log(code);
          return fetch(`https://date.nager.at/api/v3/PublicHolidays/${startDay.getFullYear()}/${code}`);
        })
        .then(res => {
          console.log("res: ", res)
          return res.json()
        })
        .then(holidays => {
          console.log(holidays);
          if (!holidays) return;
          const events: EventPreview[] = holidays.map((h: any, index: number) => {
            const start = new Date(`${h.date}T00:00:00`);
            const end = new Date(start);
            end.setHours(23, 59, 0, 0);
            return {
              id: index.toString(),
              calendarId: "0",
              title: h.localName,
              startDate: start,
              endDate: end,
              color: "#823CCDFF"
            }
          });
          console.log("Holidays for country:", events);
          addEvents(events);
        })
        .catch(err => {
          console.error(err);
        });
    }

  }, [getUser()]);

  const formatEvents = (events: EventFromServerType[]) => {
    const expanded: EventPreview[] = [];

    const pushEvent = (event: EventFromServerType) => {
      expanded.push({
        id: event.id,
        calendarId: event.calendarId,
        title: event.title,
        color: event.color,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      })
    }

    for (const event of events) {
      if (!event.isRepeat || !event.period || !event.startRepeatDate || !event.endRepeatDate) {
        pushEvent(event);
        continue;
      }

      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const delta = end.getTime() - start.getTime();

      const cur = new Date(event.startRepeatDate);
      const repeatEnd = new Date(event.endRepeatDate);

      while (cur <= repeatEnd) {
        const newEnd = new Date(cur);
        newEnd.setTime(newEnd.getTime() + delta);
        const newEvent = {
          ...event,
          startDate: new Date(cur).toISOString(),
          endDate: newEnd.toISOString(),
        }
        pushEvent(newEvent);
        if (event.period === "everyday") cur.setDate(cur.getDate() + 1);
        else if (event.period === "everyweek") cur.setDate(cur.getDate() + 7);
        else if (event.period === "everymonth") cur.setMonth(cur.getMonth() + 1);
        else if (event.period === "everyyear") cur.setFullYear(cur.getFullYear() + 1);
      }
    }
    return expanded;
  }

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await GET(`calendar/${getCalendarId()}/events?year=${startDay.getFullYear()}`);
      console.log(result);
      if (!result.success) {
        setLoading(false);
        return;
      }
      console.log(result.data);
      const formattedEvents = formatEvents(result.data);
      console.log(formattedEvents);
      addEvents(formattedEvents);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (prevStartDayRef.current && startDay && prevStartDayRef.current.getFullYear() < startDay.getFullYear())
      if (getCalendarId() !== "0") fetchEvents();
    prevStartDayRef.current = startDay;
  }, [startDay]);

  useEffect(() => {
    if (getCalendarId() !== "0") fetchEvents();
  }, [getCalendarId()]);

  const getForDay = (date: Date): EventPreview[] => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23,59,59,999);

    const forCalendar = events[getCalendarId()] || [];
    const forDay = forCalendar.filter(
      e => e.startDate <= endOfDay && e.endDate >= startOfDay
    );

    console.log(forDay);
    return forDay;
  };

  const getForWeek = (): EventPreview[] => {
    return []
  };

  const getForMonth = (): EventPreview[] => {
    return [];
  }

  const getForYear = (): EventPreview[] => {
    return [];
  }

  const getAll = (): EventPreview[] => {
    return events[getCalendarId()] || []
  }


  const addEvents = (data: EventPreview[]): void => {
    setEvents(prev => {
      const copy = { ...prev };

      for (const ev of data) {
        const calendarId = ev.calendarId;
        if (!copy[calendarId]) copy[calendarId] = [];

        const exists = copy[calendarId].some(existing =>
          existing.id ===ev.id ||
          (existing.title === ev.title &&
          existing.startDate.getTime() === ev.startDate.getTime() &&
          existing.endDate.getTime() === ev.endDate.getTime())
        );

        if (!exists) {
          copy[calendarId] = [ev, ...copy[calendarId]];
        }
      }

      return copy;
    });
  };

  const deleteEvent = (event: EventPreview): void => {
    setEvents(prev => {
      const copy = { ...prev };
      if (!copy[event.calendarId]) return copy;

      return {
        ...copy,
        [event.calendarId]: copy[event.calendarId].filter(ev => ev.id !== event.id)
      };
    });
  }

  return <EventContext.Provider value={{loading, getForDay, getForWeek, getForMonth, getForYear, addEvents, deleteEvent, getAll}}>{children}</EventContext.Provider>
}

export default EventProvider;