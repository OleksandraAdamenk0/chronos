import userModel from "../../models/UserModel";
import calendarUserModel from "../../models/CalendarUserModel";

export const changeUserService = async (
  userId: string,
  { email, fullName, avatar, country }:
  { email: string; fullName: string; avatar?: string; country: string }
) => {

  const updateData: any = { email, fullName, country };
  if (avatar) updateData.avatar = avatar;
  return await userModel.updateOne(
    { _id: userId },
    { $set: updateData }
  ).exec();
};

export const deleteUserService = async (userId: string) => {
  await userModel.deleteOne({ _id: userId }).exec();
  await calendarUserModel.deleteMany({userId: userId}).exec();
}