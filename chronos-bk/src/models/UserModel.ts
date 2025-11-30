import { Document, Schema, Model, model } from "mongoose";

import {UserDBType} from "../types";

// type for the document
export interface IUser extends Document, UserDBType {
  email: string;
  fullName: string;
  avatar: string;
  country: string;
  password: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const userSchema: Schema<IUser>  = new Schema({
  login: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, default: "" },
  avatar: { type: String, default: "" },
  country: { type: String, required: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Model
const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;