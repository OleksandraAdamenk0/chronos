import {Request, Response} from 'express';

// services
import {registrationService, loginService, confirmService} from "./service";

// types
import type {RegistrationRequestType, LoginRequestType} from "../../types";
import {generateTokens} from "../security/tokens";

export const verifyToken = (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  
  console.log("tokens: ", accessToken, refreshToken);
  return res.status(200).json({})
}

export const registrationController = async (req: Request, res: Response) => {
  // check data
  const data: RegistrationRequestType = req.body;
  if (!data.email || !data.login || !data.password || !data.country) return res.status(400).json({
    success: false,
    error: "Some data weren't provided"
  })

  try {
    await registrationService(data);
    return res.status(200).json({
      success: true,
      data: { "message": "User registered successfully" }
    })
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      error: error.message
    })
  }
}

export const loginController = async (req: Request, res: Response) => {
  // check data
  const data: LoginRequestType = req.body;
  if (!data.email || !data.login || !data.password) res.status(400).json({
    success: false,
    error: "Some data weren't provided"
  })

  try {
    const user = await loginService(data);
    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message
    })
  }
}

export const confirmController = async (req: Request, res: Response) => {
    // get email token
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required" });

    try {
      // confirm account
      const userId = await confirmService(token);
      const { accessToken, refreshToken } = await generateTokens(userId);

      // set cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        path: "/"
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        path: "/"
      });

      return res.redirect(`${process.env.CLIENT}/calendar`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server error" });
    }
}