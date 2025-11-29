import {createContext} from 'react';

import type {CalendarPreviewType, CategoryType, ViewType, PermissionsType} from "@/types";

type CalendarContextType = {
  getPermissions: () => PermissionsType;
  getCalendarId: () => string;
  setCalendarId: (id: string) => void;
  startDay: Date;
  setStartDay: (date: Date) => void;
  getView: () => ViewType;
  setView: (view: ViewType) => void;
  getCalendars: () => CalendarPreviewType[];
  getCategories: () => CategoryType[];
  addCalendars: (calendars: CalendarPreviewType[]) => void;
  deleteCalendar: (id: string) => void;
  getStartWeek: () => Date;
  loading: boolean;
};

export const CalendarContext = createContext<CalendarContextType | null>(null);
