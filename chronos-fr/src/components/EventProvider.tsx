import React, {type ReactNode, useEffect, useState} from "react";
import type {EventPreview} from "@/types";

import {EventContext} from "@/contexts/EventContext.tsx";

import {useCalendar} from "@/hooks/useCalendar.ts";
import {useUser} from "@/hooks/useUser.ts";
import {getCountryCodeByName} from "@/utils/country.ts";

interface Props {
  children: ReactNode;
}

const EventProvider: React.FC<Props> = ({ children }: Props) => {
  const [events, setEvents] = useState<Record<string, EventPreview[]>>({})
  const {getUser} = useUser();
  const {getCalendarId, startDay} = useCalendar();

  useEffect(() => {
    console.log("this log is needed to render event provider. I don't know why and i don't give a fuck");
  }, []);

  // default calendar events
  useEffect(() => {
    console.log("it's working");
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

  const getForDay = (date: Date): EventPreview[] => {
    const forCalendar = events[getCalendarId()] || [];
    return forCalendar.filter(e => e.startDate <= date && e.endDate >= date);
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
          existing.title === ev.title &&
          existing.startDate.getTime() === ev.startDate.getTime() &&
          existing.endDate.getTime() === ev.endDate.getTime()
        );

        if (!exists) {
          copy[calendarId] = [ev, ...copy[calendarId]];
        }
      }

      return copy;
    });
  };

  return <EventContext.Provider value={{getForDay, getForWeek, getForMonth, getForYear, addEvents, getAll}}>{children}</EventContext.Provider>
}

export default EventProvider;