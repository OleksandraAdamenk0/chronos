import { Document, Schema, Model, model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  color: string;
  calendarId: Types.ObjectId;
  authorId: Types.ObjectId;
}

// schema
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  color: { type: String, required: true },
  calendarId: { type: Schema.Types.ObjectId, ref: "Calendar", required: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

// model
const category: Model<ICategory> = model<ICategory>("Category", categorySchema);

export default category;
