// types
import type {LoginFormType, SignupFormType, UserType} from "@/types";
import {AxiosError} from "axios";

// api function
import {checkApiError, POST} from "@/utils/api.ts";

// validation
import {validateLoginForm, validateSignupForm} from "@/utils/validation.ts";
import {uploadAvatar} from "@/utils/upload.ts";

const handleError = (error: unknown, mode: "Login" | "Registration"): never => {
  console.error(error);

  // Axios errors
  if (error instanceof AxiosError && error.response?.status) {
    if (error.response.status === 404) throw new Error("Resources were not found!");
    else throw new Error(error.response.data.error);
  }

  // generic errors
  if (error instanceof Error) throw new Error(error.message || `${mode} failed.`);
  throw new Error(String(error) || `${mode} failed.`);
}


// validates data
// sends to the server
// returns full user data
// in case of error prints it and sends up
export const login = async ({login, email, password}: LoginFormType): Promise<UserType> => {
  // validation
  try {
    validateLoginForm({login, email, password});
  } catch (error) {
    console.error(error);
    throw error;
  }

  try {
    // API request
    const data = await POST('auth/login', {login, email, password});
    checkApiError(data);

    // ensure right data format
    // data will be handled at a higher lvl
    return {
      ...data.data,
      fullName: data.data.fullName || "",
      avatar: data.data.avatar || "/avatar-placeholder.png",
    };

  } catch (error) {
    console.log(error);
    handleError(error, "Login");
    throw error;
  }
}

// validates data
// sends to the server
// returns true if everything went fine
// in case of error prints it and sends up
export const register = async ({login, email, password, confirmPassword,
                                 avatar, fullName, country}: SignupFormType):Promise<boolean> => {
  // validation
  try {
    validateSignupForm({login, email, password, confirmPassword});
  } catch (error) {
    console.error(error);
    throw error;
  }

  try {
    const formatedFullName = (fullName && fullName.trim().length > 0)? fullName.trim() : undefined;

    // upload photo
    const photoAddress = avatar? await uploadAvatar(avatar): undefined;

    // API request
    const dataToSend = {login, email, password, confirmPassword, avatar: photoAddress, fullName: formatedFullName, country};
    const data = await POST("auth/register", dataToSend);

    // check response status
    if (!(data?.success)) throw new Error(data.error);

    return true;
  } catch (error) {
    handleError(error, "Registration");
    throw error;
  }
}