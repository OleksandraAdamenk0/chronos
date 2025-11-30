import {UPLOAD_PHOTO} from "@/utils/api.ts";

export const uploadAvatar = async (avatar: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  const result = await UPLOAD_PHOTO(formData);
  return result.data.data;
}