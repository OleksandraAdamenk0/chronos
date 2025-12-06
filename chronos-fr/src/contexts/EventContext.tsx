
import {createContext} from 'react';

import type {EventPreview} from "@/types";

type EventContextType = {
  loading: boolean;
  getAll: () => EventPreview[];
  getForDay: (date: Date) => EventPreview[];
  getForWeek: (date: Date) => EventPreview[];
  getForMonth: (date: Date) => EventPreview[];
  getForYear: (date: Date) => EventPreview[];
  addEvents: (event: EventPreview[]) => void;
  deleteEvent: (event: EventPreview) => void;
};

export const EventContext = createContext<EventContextType | null>(null);
