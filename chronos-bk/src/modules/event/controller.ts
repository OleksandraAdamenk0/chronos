import type { Request, Response } from 'express';
import {
  createEventService,
  getEventsService,
  getEventColorService,
  deleteEventService,
  getEventDetailsService, changeEventService
} from "./service";
import {getPermissionsService} from "../calendar/service";

export const createEventController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const data = req.body;

  if (!userId || !calendarId || !data) return res.status(400).json({success: false, error: "Necessary data weren't provided"});

  try {
    const permissions = await getPermissionsService(userId, calendarId);
    if (!permissions || !(permissions.manageEvents)) return res.status(403).json({success: false, error: "You don't have permissions to create event"});
    const event = await createEventService(userId, calendarId, data);
    console.log(event);
    const color = await getEventColorService(userId, event);
    return res.status(201).json({success: true, data: {id: event.id, color}});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error.message});
  }
}

export const changeEventController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const eventId = req.params.eventId;
  const data = req.body;

  if (!userId || !calendarId || !eventId || !data)
    return res.status(400).json({success: false, error: "Necessary data weren't provided"});
  try {
    const permissions = await getPermissionsService(userId, calendarId);
    if (!permissions || !(permissions.manageEvents))
      return res.status(403).json({success: false, error: "You don't have permissions to create event"});
    const event = await changeEventService(calendarId, eventId, data);
    if (!event) return res.status(500).json({success: false, error: "Something went wrong"})
    const color = await getEventColorService(userId, event);
    return res.status(201).json({success: true, data: {...event, id: event?._id, color}});
  } catch (error: any) {
    return res.status(500).json({success: false, error: error.message || "Something went wrong"});
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

export const getEventDetailsController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const eventId = req.params.eventId;
  console.log(userId, calendarId, eventId);
  if (!userId || !calendarId || !eventId) return res.status(400).json({success: false, error: "Necessary data weren't provided"});
  try {
    const event = await getEventDetailsService(userId, calendarId, eventId);
    return res.status(200).json({success: true, data: event});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({success: false, error: error.message});
  }
}

export const deleteEventController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const eventId = req.params.eventId;

  try {
    if (!userId || !calendarId || !eventId) return res.status(400).json({success: false, error: "Necessary data weren't provided"});
    const permissions = await getPermissionsService(userId, calendarId);
    console.log("userId ", userId, "calendarId: ", calendarId, permissions);
    if (!permissions || !(permissions.manageEvents)) return res.status(403).json({success: false, error: "You don't have permissions to delete this event."});
    await deleteEventService(eventId);
    return res.status(200).json({success: true, data: {}});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({success: false, error: error.message});
  }

}