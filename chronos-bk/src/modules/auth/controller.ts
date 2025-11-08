import {Request, Response} from 'express';

// services
import {registrationService, loginService} from "./service";

// types
import type {RegistrationRequestType, LoginRequestType} from "../../types";

export const verifyToken = (req: Request, res: Response) => {
  return res.status(200).send({})
}

export const registrationController = async (req: Request, res: Response) => {
  // check data
  const data: RegistrationRequestType = req.body;
  if (!data.email || !data.login || !data.password || !data.country) res.status(400).json({
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
    res.status(status).json({
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
      data: { "message": "User registered successfully" }
    })
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.message
    })
  }
}