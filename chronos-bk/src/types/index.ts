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