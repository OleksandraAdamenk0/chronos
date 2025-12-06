import calendarModel from "../../models/CalendarModel";
import calendarUserModel from "../../models/CalendarUserModel";
import categoryModel from "../../models/CategoryModel";
import {PermissionsType} from "../../types";
import eventModel from "../../models/EventModel";

export const createCalendarService = async (name: string, type: string, authorId: string) => {
  const result = await calendarModel.insertOne({name: name, type: type, authorId: authorId});
  return result._id as string;
}

export const createCalendarUserService = async (userId: string, calendarId: string, color: string, permissions: PermissionsType) => {
  await calendarUserModel.insertOne({userId: userId, calendarId: calendarId, color: color, permissions: permissions});
}

export const getAllCalendarsService = async (id: string) => {
  const rowResult = await calendarUserModel.find({userId: id}).exec();
  const result = await Promise.all(rowResult.map(async c => {
    const calendar = await calendarModel.findById(c.calendarId).exec();
    if (!calendar) throw new Error("Calendar not found");
    return {
      id: c.calendarId,
      name: calendar.name,
      type: calendar.type,
      color: c.color
    }
  }));
  console.log(result);
  return result;
}

export const getCalendarColorService = async (userId: string, calendarId: string) => {
  const rowResult = await calendarUserModel.find({userId: userId, calendarId: calendarId}).exec();
  if (!rowResult || !rowResult[0]) throw new Error("No recording about this user and calendar was found")
  return rowResult[0].color;
}

export const getCalendarService = async (id: string) => {
  const rowResult = await calendarModel.findById(id).exec();
  if (!rowResult) throw new Error("No calendar found");
  const result = {
    id: rowResult.id,
    name: rowResult.name,
    type: rowResult.type
  }
  return result;
}

export const getPermissionsService = async (userId: string, calendarId: string) => {
  const rowResult = await calendarUserModel.find({userId: userId, calendarId: calendarId}).exec();
  if (!rowResult || !rowResult[0]) throw new Error("No recording about this user and calendar was found");
  const permissions = rowResult[0].permissions;
  return permissions;
}

export const getCalendarCategoriesService = async (id: string) => {
  const rowResult = await categoryModel.find({calendarId: id}).exec();
  if (!rowResult) return [];
  return rowResult.map(c => {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      color: c.color,
    }
  })
}

export const deleteCalendarService = async (calendarId: string) => {
  await calendarModel.findByIdAndDelete(calendarId).exec();
  await calendarUserModel.deleteMany({ calendarId: calendarId}).exec();
  await eventModel.deleteMany({ calendarId: calendarId }).exec();
}

export const deleteUserFromCalendarService = async (userId: string, calendarId: string) => {
  const rowResult = await calendarUserModel.find({userId: userId, calendarId: calendarId}).exec();
  const record = rowResult[0];
  if (!record) throw new Error("No recording about this user and calendar was found");
  await calendarUserModel.findByIdAndDelete(record.id).exec();
}

export const changeCalendarService = async (id: string, name: string, type: string, authorId: string) => {
  const result = await calendarModel.updateOne({_id: id}, {name: name, type: type, authorId: authorId}).exec();
  if (result.matchedCount === 0) throw new Error("Calendar not found");
}

export const changeCalendarUserService = async (userId: string, calendarId: string, color: string, permissions: PermissionsType | undefined = undefined) => {
  const updateData: any = { color };
  if (permissions) updateData.permissions = permissions;
  const result = await calendarUserModel.updateOne({calendarId: calendarId, userId: userId}, updateData).exec();
  if (result.matchedCount === 0) throw new Error("Calendar not found");
}