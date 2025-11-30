import type { Request, Response } from 'express';
import {createEventService, getEventsService, getEventColorService} from "./service";

export const createEventController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const data = req.body;

  if (!userId || !calendarId || !data) return res.status(400).json({success: false, error: "Necessary data weren't provided"});

  try {
    const event = await createEventService(userId, calendarId, data);
    console.log(event);
    const color = await getEventColorService(event);
    return res.status(201).json({success: true, data: {id: event.id, color}});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error.message});
  }
}

export const getEventsController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const year = Number(req.query.year);
  if (!calendarId || !year) return res.status(400).json({success: false, error: "Necessary data weren't provided"});
  try {
    const events = await getEventsService(userId, calendarId, year);
    console.log(events);
    return res.status(200).json({success: true, data: events});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error.message});
  }
}