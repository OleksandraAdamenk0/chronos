import categoryModel from "../../models/CategoryModel";

export const getCategoriesService = async (calendarId: string) => {
  return await categoryModel.find({calendarId: calendarId}).exec();
}

export const createCategoryService = async (userId: string, calendarId: string, name: string, description: string, color: string) => {
  return await categoryModel.insertOne({authorId: userId, calendarId: calendarId, name: name, description: description, color: color });
}

export const deleteCategoryService = async (categoryId: string) => {
  return await categoryModel.findByIdAndDelete(categoryId).exec();
}

export const changeCategoryService = async (categoryId: string, name: string, description: string, color: string) => {
  return await categoryModel.findByIdAndUpdate(categoryId, { $set: { name, description, color } }, { new: true }).exec();
}