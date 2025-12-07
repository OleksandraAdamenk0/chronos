import {Request, Response} from 'express';
import {changeCategoryService, createCategoryService, deleteCategoryService, getCategoriesService} from "./service";
import {getPermissionsService} from "../calendar/service";

export const getCategoriesController = async (req: Request, res: Response) => {
  const calendarId = req.params.calendarId;
  if (!calendarId) return res.status(400).json({success: false, message: 'Data were not provided'});
  try {
    const categories = await getCategoriesService(calendarId);
    res.status(200).json({success: true, data: categories.map(({id, name, description, color, ...category}) => {
        return {id, name, description, color};}
      )});
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
}

export const createCategoryController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const { name, description, color } = req.body;
  if (!userId || !calendarId || !name || !description || !color)
    return res.status(400).json({success: false, message: 'Data were not provided'});
  try {
    const permissions = await getPermissionsService(userId, calendarId);
    if (!permissions || !(permissions.manageCategories))
      return res.status(403).json({success: false, message: 'You do not have permissions to create category'});
    const result = await createCategoryService(userId, calendarId, name, description, color);
    if (!result) return res.status(500).json({success: false, message: 'Something went wrong'});
    res.status(200).json({success: true, data: {
        id: result._id,
        authorId: result.authorId,
        calendarId: result.calendarId,
        name: result.name,
        description: result.description,
        color: result.color,
      }});
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
}

export const deleteCategoryController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const categoryId = req.params.id;
  if (!userId || !calendarId || !categoryId)
    return res.status(400).json({success: false, message: 'Data were not provided'});
  try {
    const permissions = await getPermissionsService(userId, calendarId);
    if (!permissions || !(permissions.manageCategories))
      return res.status(403).json({success: false, message: 'You do not have permissions to delete category'});
    await deleteCategoryService(categoryId);
    return res.status(200).json({success: true, data: {}});
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
}

export const changeCategoryController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const calendarId = req.params.calendarId;
  const categoryId = req.params.id;
  const { name, description, color } = req.body;
  if (!userId || !calendarId || !categoryId || !name || !description || !color)
    return res.status(400).json({success: false, message: 'Data were not provided'});
  try {
    const permissions = await getPermissionsService(userId, calendarId);
    if (!permissions || !(permissions.manageCategories))
      return res.status(403).json({success: false, message: 'You do not have permissions to change category'});
    const result = await changeCategoryService(categoryId, name, description, color);
    if (!result) return res.status(500).json({success: false, message: 'Something went wrong'});
    res.status(200).json({success: true, data: {
      id: result._id,
        authorId: result.authorId,
        calendarId: result.calendarId,
        name: result.name,
        description: result.description,
        color: result.color,
    }});
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
}