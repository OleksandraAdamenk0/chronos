// ==============================================
// Auth
// ==============================================

export type RegistrationRequestType = {
  login: string;
  email: string;
  fullName?: string;
  password: string;
  avatar?: string;
  country: string;
}

export type LoginRequestType = {
  login: string;
  email: string;
  password: string;
}

// ==============================================
// User
// ==============================================

export type UserDBType = {
  login: string;
  email: string;
  fullName?: string;
  avatar?: string;
  country: string;
  password: string;
  confirmed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserResponseType = Omit<UserDBType, "password" | "confirmed">

// ==============================================
// Permissions
// ==============================================

export type PermissionsType = {
  manageCalendar: boolean;
  manageParticipants: boolean;
  manageCategories: boolean;
  manageEvents: boolean;
}

// ==============================================
// Calendar
// ==============================================

export type RepeatType = "everyday" | "everyweek" | "everymonth" | "everyyear";

// ==============================================
// Events
// ==============================================

export type CreateEventDataType = {
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  isRepeat: boolean,
  address?: string,
  startRepeatDate?: string,
  endRepeatDate?: string,
  period?: RepeatType;
  reminder?: string,
  categoryId?: string,
}

