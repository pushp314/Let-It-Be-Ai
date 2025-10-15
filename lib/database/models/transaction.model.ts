
import { Schema, model, models, Document } from "mongoose";

export interface ITransaction extends Document {
    _id: string;
    createdAt: Date;
    razorpayId: string;
    razorpayOrderId: string;
    amount: number;
    plan?: string;
    credits?: number;
    buyer: Schema.Types.ObjectId;
}

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  razorpayId: {
    type: String,
    required: true,
    unique: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction =
  models?.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
