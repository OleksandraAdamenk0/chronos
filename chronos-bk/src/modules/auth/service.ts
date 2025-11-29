import bcrypt from "bcrypt";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

// types
import {LoginRequestType, RegistrationRequestType, UserDBType, UserResponseType} from "../../types";

// models
import User from "../../models/UserModel";
import {
  checkAccessToken,
  checkConfirmToken,
  checkRefreshToken,
  generateAccessToken,
  generateConfirmationToken
} from "../security/tokens";
import {sendConfirmationEmail} from "../notification/mailSender";

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

  // confirmation mail
  try {
    const token = generateConfirmationToken(userId);
    const url = `${HOST}${PORT}/api/v1/auth/confirm/${token}`;
    await sendConfirmationEmail(data.email, url);
  } catch (err) {
    console.log(err);
    await User.deleteOne({ _id: userId });
    throw {status: 500, message: "Internal Server Error"};
  }

}

export const loginService = async (data: LoginRequestType): Promise<{ user: UserResponseType, id: string }> => {
  // existingEmail
  if (!(await User.findOne({ email: data.email }))) {
    throw {status: 409, message: "User with such email does not exist"};
  }

  // existingLogin
  if (!(await User.findOne({ login: data.login }))) {
    throw {status: 409, message: "User with such login does not exist"};
  }

  // get user
  const foundUser = await User.findOne({ login: data.login, email: data.email }).lean();
  if (!foundUser) throw {status: 404, message: "User not found"};

  const { password, confirmed, _id, ...user } = foundUser;

  if (!(await bcrypt.compare(data.password, password))) throw {status: 401, message: "Invalid password"};
  if (!confirmed) throw {status: 401, message: "Confirm email before logging in"};


  return {user, id: _id.toString()};
}


export const confirmService = async (token: string): Promise<string> => {
  try {
    // check token
    const payload = checkConfirmToken(token);

    // update confirmation status and get user data
    const foundUser: UserDBType | null = await User.findOneAndUpdate({ _id: payload.id, }, { $set: { confirmed : true}}, { new: true });
    if (!foundUser) throw {status: 401, message: "Such user does not exist"};

    return payload.id
  } catch (err: any) {
    if (err.status && err.message) throw err;
    else throw {status: 401, message: "Invalid token"};
  }
}

export const verifyService = async (token: string): Promise<UserResponseType> => {
  try {
    const id = checkAccessToken(token);
    const foundUser = await User.findOne({ _id: id }).lean();
    if (!foundUser) throw new Error("no user with such id");
    const {password, confirmed, ...user} = foundUser;
    return user;
  } catch (error) {
    throw {status: 401, message: "Invalid token"};
  }
}

export const refreshService = async (token: string): Promise<string> => {
  try {
    const id = checkRefreshToken(token);
    const foundUser = await User.findOne({ _id: id }).lean();
    if (!foundUser) throw new Error("no user with such id");
    return generateAccessToken(id);
  } catch (error) {
    throw {status: 401, message: "Refreshing failed"};
  }
}