import bcrypt from "bcrypt";

// types
import {LoginRequestType, RegistrationRequestType, UserResponseType} from "../../types";

// models
import User from "../../models/UserModel";

export const registrationService = async (data: RegistrationRequestType): Promise<void> => {

  // existingEmail
  if (await User.findOne({ email: data.email })) {
    throw {status: 409, message: "Email already exists"};
  }

  // existingLogin
  if (await User.findOne({ login: data.login })) {
    throw {status: 409, message: "Login already exists"};
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = new User({...data, password: hashedPassword});

  const savedUser = await newUser.save();

  // @ts-ignore
  const userId = savedUser._id.toString();
}

export const loginService = async (data: LoginRequestType): Promise<UserResponseType> => {
  // existingEmail
  if (!(await User.findOne({ email: data.email }))) {
    throw {status: 409, message: "User with such email does not exist"};
  }

  // existingLogin
  if (!(await User.findOne({ login: data.login }))) {
    throw {status: 409, message: "User with such login does not exist"};
  }

  // get user
  const foundUser = await User.findOne({ login: data.login, email: data.email }).exec();
  if (!foundUser) throw {status: 404, message: "User not found"};

  const { password, confirmed, ...user } = foundUser.toObject();

  if (!(await bcrypt.compare(data.password, password))) throw {status: 401, message: "Invalid password"};
  if (!confirmed) throw {status: 401, message: "Confirm email before logging in"};

  return user;
}