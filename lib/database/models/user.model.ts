
import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    googleId: string;
    email: string;
    username: string;
    photo: string;
    firstName?: string;
    lastName?: string;
    planId: number;
    creditBalance: number;
    role: string;
    lastLogin: Date;
}

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 10,
  },
  role: {
    type: String,
    default: 'user',
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
