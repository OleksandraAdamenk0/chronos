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
  addCategory: (category: CategoryType) => void;
  deleteCategory: (categoryId: string) => void;
  updateCategory: (category: CategoryType) => void;
  addCalendars: (calendars: CalendarPreviewType[]) => void;
  deleteCalendar: (id: string) => void;
  changeCalendar: (id: string, data: Omit<CalendarPreviewType, "id">) => void;
  getStartWeek: () => Date;
  loading: boolean;
};

export const CalendarContext = createContext<CalendarContextType | null>(null);
