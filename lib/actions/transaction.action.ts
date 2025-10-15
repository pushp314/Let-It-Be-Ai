"use server";

import { redirect } from 'next/navigation'
import Razorpay from "razorpay";
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';

export async function createRazorpayOrder(transaction: any) {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const amount = Number(transaction.amount) * 100;

  const options = {
    amount: amount,
    currency: "INR",
    receipt: "receipt_order_74394",
    notes: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    }
  };

  const order = await instance.orders.create(options);

  return JSON.parse(JSON.stringify(order));
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction, buyer: transaction.buyerId
    })

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}