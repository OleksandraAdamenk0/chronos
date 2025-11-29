// utils
type HexColorType = `#${string}`;

// user
export type UserType = {
  id: number,
  login: string,
  fullName: string,
  email: string,
  avatar: string,
  country: string,
}

// auth
export type LoginFormType = {
  login: string,
  email: string,
  password: string,
}

export type SignupFormType = {
  login: string;
  email: string;
  fullName?: string;
  password: string;
  confirmPassword: string; // used on frontend, but doesn't need to be sent on backend
  avatar: File | null; // before registration avatar is not saved on server and therefore is a file
  country: string;
}

// categories

export type CategoryType = {
  id: string;
  name: string;
  description: string;
  color: HexColorType;
}

// permissions
export type PermissionsType = {
  manageCalendar: boolean;
  manageParticipants: boolean;
  manageCategories: boolean;
  manageEvents: boolean;
}

// calendar
export type ViewType = "day" | "week" | "month" | "year" | "events";
export type RepeatType = "everyday" | "everyweek" | "everymonth" | "everyyear";

export type CalendarPreviewType = {
  id: string,
  name: string,
  color: string,
  type: "personal" | "shared" | "holiday"
}

export type CalendarFullType = CalendarPreviewType & {
  categories: CategoryType[];
  permissions: PermissionsType;
}

// events

// comes from server
export type EventData = {
  id: string;
  calendarId: string;
  title: string;
  startDate: string;
  endDate: string;
  isRepeat: boolean;
  startRepeatDate: string;
  endRepeatDate: string;
  period: RepeatType;
  color: HexColorType;
};

export type EventCreateType = {
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  isRepeat: boolean,
  address: string,
  startRepeatDate?: string,
  endRepeatDate?: string,
  period?: RepeatType;
  reminder?: string,
}

export type EventPreview = {
  id: string;
  calendarId: string;
  title: string;
  color: string;
  startDate: Date;
  endDate: Date;
}