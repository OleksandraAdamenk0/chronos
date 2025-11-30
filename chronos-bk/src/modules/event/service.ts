import {CreateEventDataType} from "../../types";
import eventModel, {IEvent} from "../../models/EventModel";
import categoryModel from "../../models/CategoryModel";
import calendarModel from "../../models/CalendarModel";
import calendarUserModel from "../../models/CalendarUserModel";

export const createEventService = async (authorId: string, calendarId: string, data: CreateEventDataType) => {
  const DTI:
    Omit<CreateEventDataType, "startDate" | "endDate" | "startRepeatDate" | "endRepeatDate">
    & {authorId: string, calendarId: string, startDate: Date, endDate: Date, startRepeatDate?: Date, endRepeatDate?: Date, reminderTime?: Date} = {
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
  return await eventModel.insertOne(DTI)
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

export const getEventColorService = async (event: IEvent): Promise<string> => {
  if (event.categoryId) {
    const category = await categoryModel.findById(event.categoryId).exec();
    if (!category) throw new Error(`Category with id ${event.categoryId} not found`);
    return category.color;
  } else {
    const calendarUser = await calendarUserModel.findOne({userId: event.authorId, calendarId: event.calendarId}).exec();
    if (!calendarUser) throw new Error(`Record about user with id ${event.authorId} and calendar with id ${event.calendarId} not found`);
    return calendarUser.color;
  }
}