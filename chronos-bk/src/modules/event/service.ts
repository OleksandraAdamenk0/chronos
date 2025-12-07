import {CreateEventDataType} from "../../types";
import eventModel, {IEvent} from "../../models/EventModel";
import categoryModel from "../../models/CategoryModel";
import calendarUserModel from "../../models/CalendarUserModel";
import category from "../../models/CategoryModel";
import userModel from "../../models/UserModel";
import EventModel from "../../models/EventModel";
import CategoryModel from "../../models/CategoryModel";
import CalendarUserModel from "../../models/CalendarUserModel";

export const createEventService = async (authorId: string, calendarId: string, data: CreateEventDataType) => {
  const DTI:
    Omit<CreateEventDataType, "startDate" | "endDate" | "startRepeatDate" | "endRepeatDate"> & {
      authorId: string,
      calendarId: string,
      startDate: Date,
      endDate: Date,
      startRepeatDate?: Date,
      endRepeatDate?: Date,
      reminderTime?: Date,
      categoryId?: string,
  } =
    {
    authorId,
    calendarId,
    title: data.title,
    description: data.description,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    isRepeat: data.isRepeat,
  }

  if (data.isRepeat) {
    if (data.startRepeatDate) DTI.startRepeatDate = new Date(data.startRepeatDate);
    if (data.endRepeatDate) DTI.endRepeatDate = new Date(data.endRepeatDate);
    if (data.period && data.period.length > 0) DTI.period = data.period;
  }
  if (data.reminder) DTI.reminderTime = new Date(data.reminder);
  if (data.address) DTI.address = data.address;
  if (data.categoryId) DTI.categoryId = data.categoryId;
  return await eventModel.insertOne(DTI)
}

export const changeEventService = async (calendarId: string, eventId: string, data: CreateEventDataType) => {
  const DTU:
    Omit<CreateEventDataType, "startDate" | "endDate" | "startRepeatDate" | "endRepeatDate"> & {
    calendarId: string,
    startDate: Date,
    endDate: Date,
    startRepeatDate?: Date,
    endRepeatDate?: Date,
    reminderTime?: Date,
    categoryId?: string,
  } =
    {
      calendarId,
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isRepeat: data.isRepeat,
    }

  if (data.isRepeat) {
    if (data.startRepeatDate) DTU.startRepeatDate = new Date(data.startRepeatDate);
    if (data.endRepeatDate) DTU.endRepeatDate = new Date(data.endRepeatDate);
    if (data.period && data.period.length > 0) DTU.period = data.period;
  }
  if (data.reminder) DTU.reminderTime = new Date(data.reminder);
  if (data.address) DTU.address = data.address;
  if (data.categoryId) DTU.categoryId = data.categoryId;

  return  await EventModel.findByIdAndUpdate(eventId, { $set: DTU }, { new: true }).exec();
}

export const getEventsService = async (userId: string, calendarId: string, year: number) => {
  const events = await eventModel.find({calendarId: calendarId}).exec();
  return await Promise.all(
    events
    .filter(event => event.startDate.getFullYear() === year || event.endDate.getFullYear() === year)
    .map(async event => {
      let color: string | undefined = undefined;

      if (event.categoryId) {
        const category = await categoryModel.findById(event.categoryId).exec();
        color = category?.color;
      }
      if (!color) {
        const userCalendar = await calendarUserModel.findOne({userId: userId, calendarId: calendarId}).exec();
        color = userCalendar?.color;
      }

      return {
        id: event.id,
        calendarId: calendarId,
        title: event.title,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        ...(color && { color }),
        ...(event.startRepeatDate && {startRepeatDate: event.startRepeatDate.toISOString()}),
        ...(event.endRepeatDate && {endRepeatDate: event.endRepeatDate.toISOString()})
      }
    })
  );
}

export const getEventDetailsService = async (userId: string, calendarId: string, eventId: string) => {
  const eventData = await eventModel.findOne({calendarId: calendarId, _id: eventId}).exec();
  if (!eventData) throw new Error("No event with id " + calendarId);
  const color = await getEventColorService(userId, eventData);
  if (!color) throw new Error("No color with id " + calendarId);
  const category = eventData.categoryId ? await categoryModel.findById(eventData.categoryId): undefined;
  const author = await userModel.findById(eventData.authorId).exec();
  const result = {
    id: eventId,
    calendarId: eventData.calendarId,
    title: eventData.title,
    description: eventData.description,
    color: color,
    address: eventData.address,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    reminder: eventData.reminderTime,
    category: category,
    author: author? {
      id: author.id,
      login: author.login,
      email: author.email,
      fullName: author.fullName,
      avatar: author.avatar,
      country: author.country
    } : undefined,
  }
  console.log("event details: ", result);
  return result;
}

export const getEventColorService = async (userId: string, event: IEvent): Promise<string> => {
  if (event.categoryId) {
    const category = await categoryModel.findById(event.categoryId).exec();
    if (!category) throw new Error(`Category with id ${event.categoryId} not found`);
    return category.color;
  } else {
    const calendarUser = await calendarUserModel.findOne({userId: userId, calendarId: event.calendarId}).exec();
    if (!calendarUser) throw new Error(`Record about user with id ${event.authorId} and calendar with id ${event.calendarId} not found`);
    return calendarUser.color;
  }
}

export const deleteEventService = async (eventId: string): Promise<void> => {
  const result = await eventModel.findByIdAndDelete(eventId);
  if (!result) throw new Error(`Event with id ${eventId} not found`);
}