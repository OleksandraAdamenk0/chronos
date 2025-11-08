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