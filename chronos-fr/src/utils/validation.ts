import type {LoginFormType, SignupFormType} from "@/types";

const validateLogin = (data: string): void => {
  if (data.length <= 4) throw new Error("Login is too short");
}

export const validateEmail = (data: string): void => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(data)) throw new Error("Email is invalid");
}

const validatePassword = (data: string): void => {
  const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!re.test(data)) throw new Error("Your password must be strong: at least 8 characters, " +
    "including one uppercase letter, one number, and one special character (for example, ! @ # $ % ^ & *).");
}

const validateConfirmation = (pass: string, confirm: string): void => {
  if (pass !== confirm ) throw new Error("Confirm password must match");
}

export const validateLoginForm = ({login, email, password}: LoginFormType): void => {
  validateLogin(login);
  validateEmail(email);
  validatePassword(password);
}

export const validateSignupForm = ({login, email, password, confirmPassword}: Omit<SignupFormType, "country" | "avatar">): void => {
  validateLogin(login);
  validateEmail(email);
  validatePassword(password);
  validateConfirmation(password, confirmPassword);
}