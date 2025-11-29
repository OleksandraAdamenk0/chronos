import {Request, Response} from 'express';

// services
import {registrationService, loginService, confirmService, verifyService, refreshService} from "./service";

// types
import type {RegistrationRequestType, LoginRequestType} from "../../types";
import {checkAccessToken, generateTokens} from "../security/tokens";

export const verifyToken = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  try {
    const user = await verifyService(accessToken);
    return res.status(200).json({success: true, data: user});
  } catch (error: any) {
    return res.status(error.status).json({success: false, error: error.message});
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const accessToken = await refreshService(refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      path: "/"
    });
    return res.status(200).json({status: "success", data: {message: "Token refreshed successfully"}});
  } catch (error: any) {
    return res.status(error.status).json({status: "error", error: error.message});
  }
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
    const {user, id} = await loginService(data);
    const { accessToken, refreshToken } = generateTokens(id);

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

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", { httpOnly: true, path:"/", secure: false, sameSite: "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, path:"/", secure: false, sameSite: "lax" });
  res.json({success: true, data: {message: "Logged out"}});
}

export const confirmController = async (req: Request, res: Response) => {
    // get email token
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required" });

    try {
      // confirm account
      const userId = await confirmService(token);
      const { accessToken, refreshToken } = generateTokens(userId);

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