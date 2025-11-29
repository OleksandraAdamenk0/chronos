import type { Request, Response } from 'express';
import {
  createCalendarService, createCalendarUserService, getAllCalendarsService,
  getCalendarCategoriesService, getCalendarColorService, getCalendarService, getPermissionsService,
  deleteCalendarService, deleteUserFromCalendarService
} from "./service";
import {PermissionsType} from "../../types";

export const createCalendarController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const {name, color} = req.body;
  try {
    const id = await createCalendarService(name, "shared", userId);
    if (!id) return res.status(500).json({ error: "Internal Server Error" });
    // for author
    const permissions = {
      manageCalendar: true,
      manageParticipants: true,
      manageCategories: true,
      manageEvents: true
    }
    await createCalendarUserService(userId, id, color, permissions);
    return res.status(201).send({success: true, data: {id: id}});
  } catch (error: any) {
    console.error(error);
    return res.status(500).send({error: error?.message || undefined});
  }
}

export const getAllCalendarsController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  try {
    const calendars = await getAllCalendarsService(userId);
    const fullCalendars = await Promise.all(calendars.map(async calendar => { return {...calendar, color: await getCalendarColorService(userId, calendar.id)}}))
    return res.status(200).send({success: true, data: fullCalendars});
  } catch (error: any) {
    return res.status(500).send({success: false, error: error?.message || undefined});
  }
}

export const getCalendarController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.id;
  if (!calendarId) return res.status(400).send({success: false, error: "Calendar id was not found"});
  try {
    const rowCalendar = await getCalendarService(calendarId);
    const permissions = await getPermissionsService(userId, calendarId);
    const categories = await getCalendarCategoriesService(calendarId);
    return res.status(200).send({success: true, data: {
      ...rowCalendar,
        permissions: permissions,
        categories: categories,
      }});
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({success: false, error: err?.message || "Something went wrong"});
  }
}

export const deleteCalendarController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.id;
  if (!userId || !calendarId) return res.status(400).send({success: false, error: "Data was not provided"});
  try {
    const permissions: PermissionsType = await getPermissionsService(userId, calendarId);
    if (permissions.manageCalendar) await deleteCalendarService(calendarId);
    else await deleteUserFromCalendarService(userId, calendarId);
    return res.status(200).send({success: true, data: {message: "The calendar has been deleted."}});
  } catch (error: any) {
    console.error(error);
    return res.status(500).send({success: false, error: error?.message || "Something went wrong"});
  }

}