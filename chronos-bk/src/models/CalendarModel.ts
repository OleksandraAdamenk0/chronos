import { Document, Schema, Model, model, Types } from "mongoose";

// type for the document
export interface ICalendar extends Document {
  name: string;
  type: "personal" | "shared" | "holiday";
  authorId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// schema
const calendarSchema: Schema<ICalendar> = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["personal", "shared", "holiday"], required: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// model
const Calendar: Model<ICalendar> = model<ICalendar>("Calendar", calendarSchema);

export default Calendar;
