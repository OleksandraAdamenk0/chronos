import type {AxiosRequestConfig} from "axios";
import server from "./server.ts";
import axios from "axios";

const base = import.meta.env.VITE_API_URL;

export function GET(path: string, config?: AxiosRequestConfig) {
  return server.get(`/${path}`, config).then(res => res.data);
}

export function POST(path: string, data: any, config?: AxiosRequestConfig) {
  return server.post(`${path}`, data, config).then(res => res.data);
}

export function PATCH(path: string, data: any, config?: AxiosRequestConfig) {
  return server.patch(`/${path}`, data, config).then(res => res.data);
}

export function DELETE(path: string, config?: AxiosRequestConfig) {
  return server.delete(`/${path}`, config).then(res => res.data);
}

export const checkApiError = <T>(data: { success: boolean; data?: T; error?: string }): T => {
  console.log(data);
  if (!data?.success) throw new Error(data.error);
  return data.data!;
}

export const UPLOAD_PHOTO = async (photo: FormData) => {
  return await axios.post(`${base}upload/avatar`, photo, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
