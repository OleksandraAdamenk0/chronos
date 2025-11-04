import {Document, Schema, Model, model, Types} from "mongoose";

// type for the document
type PermissionsType = {
  manageCalendar: boolean;
  manageParticipants: boolean;
  manageCategories: boolean;
  manageEvents: boolean;
}

export interface ICalendarUser extends Document {
  userId: Types.ObjectId;
  calendarId: Types.ObjectId;
  permissions: PermissionsType;
  color?: string;
}

// schema
const calendarUserSchema = new Schema<ICalendarUser>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  calendarId: { type: Schema.Types.ObjectId, ref: "Calendar", required: true },
  permissions: { type: Object, default: {} },
  color: { type: String, default: "" },
});

// Unique pair user + calendar
calendarUserSchema.index({ userId: 1, calendarId: 1 }, { unique: true });

const calendarUser: Model<ICalendarUser> = model<ICalendarUser>("CalendarUser", calendarUserSchema);

export default calendarUser;
