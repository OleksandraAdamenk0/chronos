import {Request, Response} from "express";
import {changeUserService, deleteUserService} from "./service";

export const changeUserController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const data = req.body;
  if (!userId || !data || !data.fullName || !data.email || !data.country)
    return res.status(400).json({success: false, error: "Necessary data weren't provided"});
  try {
    await changeUserService(userId, data);
    res.status(200).json({success: true, data: data});
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({success: false, error: err});
  }
}

export const deleteUserController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) return res.status(400).json({success: false, error: "Necessary data weren't provided"});
  try {
    await deleteUserService(userId);
    res.status(200).json({success: true, data: {}});
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({success: false, error: err});
  }
}