import { Document, Schema, Model, model, Types } from "mongoose";

// type for the document
export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isRepeat: boolean;
  startRepeatDate?: Date;
  endRepeatDate?: Date;
  period?: "everyday" | "everyweek" | "everymonth" | "everyyear" | null;
  reminderTime?: Date;
  address?: string;
  calendarId: Types.ObjectId;
  authorId: Types.ObjectId;
  categoryId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const eventSchema: Schema<IEvent> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isRepeat: { type: Boolean, default: false },
  startRepeatDate: { type: Date, default: null },
  endRepeatDate: { type: Date, default: null },
  period: { type: String, enum: ["everyday", "everyweek", "everymonth", "everyyear"], default: null },
  reminderTime: { type: Date, default: null },
  address: { type: String, default: null },
  calendarId: { type: Schema.Types.ObjectId, ref: "Calendar", required: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Model
const Event: Model<IEvent> = model<IEvent>("Event", eventSchema);

export default Event;
