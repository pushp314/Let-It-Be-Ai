
"use server";

import { redirect } from 'next/navigation';
import Razorpay from "razorpay";
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';
import { env } from '@/lib/env';

export async function checkoutCredits(transaction: any) {
  const instance = new Razorpay({
    key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
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

  return { order };

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


export async function getAllTransactions({ page = 1, searchQuery = '' }: { page?: number, searchQuery?: string }) {
    try {
        await connectToDatabase();

        const skipAmount = (page - 1) * 20;
        const query = searchQuery ? { 
          $or: [
            { razorpayId: { $regex: new RegExp(searchQuery, 'i') } },
            { plan: { $regex: new RegExp(searchQuery, 'i') } },
          ]
        } : {};

        const transactions = await Transaction.find(query).skip(skipAmount).limit(20);
        const totalTransactions = await Transaction.countDocuments(query);

        return {
            data: JSON.parse(JSON.stringify(transactions)),
            totalPages: Math.ceil(totalTransactions / 20),
        };
    } catch (error) {
        handleError(error)
    }
}
