import React, {type ReactNode, useEffect, useState} from "react";
import type {CalendarFullType, CalendarPreviewType, CategoryType, PermissionsType, ViewType} from "@/types";
import {CalendarContext} from "@/contexts/CalendarContext.tsx";
import {GET} from "@/utils/api.ts";

const defaultCalendar: CalendarPreviewType = {id: "0",  name: "holidays", type: "holiday", color: "#823CCDFF"};

interface Props {
  children: ReactNode;
}

const CalendarProvider: React.FC<Props> = ({ children }: Props) => {
  const [viewValue, setViewValue] = useState<ViewType>("week");
  const [startDay, setStartDay] = useState<Date>(new Date());
  const [calendarId, setCalendarId] = useState<string>("0");
  const [currentCalendar, setCurrentCalendar] = useState<CalendarFullType | null>(null);
  const [calendars, setCalendars] = useState<CalendarPreviewType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentCalendar = async () => {
      try {
        setLoading(true);
        const result = await GET(`calendar/${calendarId}`);
        console.log(result);
        setCurrentCalendar(result.data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const fetchCateegories = async () => {
      try {
        setLoading(true);
        const result = await GET(`calendar/${calendarId}/categories`);
        setCategories(result.data? result.data: []);
      } catch (err: any) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    if (calendarId === "0") return;
    fetchCurrentCalendar();
    fetchCateegories();
  }, [calendarId]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        setLoading(true);
        const result = await GET('calendar');
        console.log(result);
        setCalendars([...result.data, defaultCalendar]);
      } catch (err) {
        console.error(err)
        setCalendars([defaultCalendar])
      } finally {
        setLoading(false);
      }
    }

    fetchCalendars();

  }, []);

  const getView = (): ViewType => {
    return viewValue;
  };

  const setView = (value: ViewType): void => {
    setViewValue(value);
  };

  const getStartWeek = (): Date => {
    const d = startDay;
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);

    return d;
  }

  const getCalendarId = (): string => {
    return calendarId;
  }

  const getCalendars = (): CalendarPreviewType[] => {
    return calendars;
  }

  const getCategories = (): CategoryType[] => {
    return categories;
  }

  const addCalendars = (data: CalendarPreviewType[]): void => {
    setCalendars([...calendars, ...data]);
  }

  const deleteCalendar = (calendarId: string): void => {
    setCalendars(calendars.filter(calendar => calendar.id !== calendarId));
  }

  const changeCalendar = (
    calendarId: string, { color, name, type }: Omit<CalendarPreviewType, "id">): void => {
    setCalendars(
      calendars.map(calendar => {
        if (calendar.id !== calendarId) return calendar;
        return { id: calendar.id, color, name, type };
      })
    );
  };


  const getPermissions = (): PermissionsType => {
    if (calendarId === "0" || (!currentCalendar)) return {
      manageEvents: false,
      manageCategories: false,
      manageCalendar: false,
      manageParticipants: false,
    }

    return currentCalendar.permissions;
  }

  return <CalendarContext.Provider value={{getCalendarId, setCalendarId,
                                           getView, setView, changeCalendar,
                                           startDay, setStartDay,
                                           getCalendars, addCalendars, deleteCalendar,
                                           getCategories, getPermissions,
                                           getStartWeek, loading
  }}>{children}</CalendarContext.Provider>
}

export default CalendarProvider;