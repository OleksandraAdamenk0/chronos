import {Request, Response} from 'express';

import {acceptInvitationService, invitationEmailService, invitationLinkService} from "./service";

export const invitationLinkController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const { permissions } = req.body;
  if (!userId || !calendarId || !permissions)
    return res.status(400).send({success: false, error: "Data was not provided"});
  try {
    const link = await invitationLinkService(userId, calendarId, permissions);
    return res.status(200).send({success: true, data: {link}});
  } catch (error: any) {
    console.log(error);
    res.status(500).send({success: false, error: error?.message || "Something went wrong"});
  }
}

export const invitationEmailController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const { permissions, email } = req.body;
  if (!userId || !calendarId || !permissions || !email)
    return res.status(400).send({success: false, error: "Data was not provided"});
  try {
    await invitationEmailService(userId, calendarId, permissions, email);
    return res.status(200).send({success: true, data: {}});
  } catch (error: any) {
    res.status(500).send({success: false, error: error?.message || "Something went wrong"});
  }
}

export const acceptInvitationController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const token = req.params.token;
  if (!userId || !token) return res.status(400).json({success: false, error: "Data was not provided"});
  try {
    await acceptInvitationService(userId, token);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({success: false, error: error?.message || "Something went wrong"});
  }
  return res.status(200).send({success: true, data: {}});
}