import {Request, Response} from 'express';
import {getCategoriesService} from "./service";

export const getCategoriesController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  if (!userId || !calendarId) return res.status(400).json({success: false, message: 'Data were not provided'});
  try {
    const categories = await getCategoriesService(calendarId);
    res.status(200).json({success: true, categories});
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
}