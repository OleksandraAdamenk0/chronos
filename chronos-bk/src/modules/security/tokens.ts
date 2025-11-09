import jwt from "jsonwebtoken";

const JWT_MAIL = process.env.JWT_MAIL;
const JWT_ACCESS = process.env.JWT_ACCESS;
const JWT_ACCESS_EXPIRATION = "1d";
const JWT_REFRESH = process.env.JWT_REFRESH;
const JWT_REFRESH_EXPIRATION = "7d";


export const generateConfirmationToken = (id: string) => {
  if (!JWT_MAIL) throw new Error('Internal server error.');
  return jwt.sign({ id: id }, JWT_MAIL);
}

export const checkConfirmToken = (token: string) => {
  if (!token) throw new Error("Token is required");
  try { return jwt.verify(token, JWT_MAIL as string) as { id: string } }
  catch (err) { throw new Error("Invalid or expired token") }
}

export const generateAccessToken =  async (id: string): Promise<string> => {
  if (!id) throw new Error("Id is required");
  if (!JWT_ACCESS || !JWT_ACCESS_EXPIRATION) throw new Error("Keys are required");
  const token = jwt.sign({id: id}, JWT_ACCESS as string, {expiresIn: JWT_ACCESS_EXPIRATION});
  if(!token) throw new Error("Internal server error.");
  return token;
}

export const generateRefreshToken = async (id: string): Promise<string> => {
  if (!id) throw new Error("Id is required");
  if (!JWT_REFRESH || !JWT_REFRESH_EXPIRATION) throw new Error("Keys are required");
  const token = jwt.sign({id: id}, JWT_REFRESH as string, { expiresIn: JWT_REFRESH_EXPIRATION});
  if(!token) throw new Error("Internal server error.");
  return token;
}

export const generateTokens = async (id: string): Promise<{ accessToken: string, refreshToken: string }> => {
  if (!id) throw new Error("Id is required");
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);
  return {accessToken, refreshToken};
}

export const checkAccessToken = (token: string): string => {
  if (!token) throw new Error("Token is required");
  try {
    const data = jwt.verify(token, JWT_ACCESS as string) as { id: string };
    return data.id;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export const checkRefreshToken = (token: string): string => {
  if (!token) throw new Error("Token is required");
  try {
    const data = jwt.verify(token, JWT_REFRESH as string) as { id: string };
    return data.id;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}