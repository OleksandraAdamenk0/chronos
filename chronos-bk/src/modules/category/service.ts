import categoryModel from "../../models/CategoryModel";

export const getCategoriesService = async (calendarId: string) => {
  return await categoryModel.find({calendarId: calendarId}).exec();
}