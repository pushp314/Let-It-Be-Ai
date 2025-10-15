
"use server"
import Razorpay from "razorpay";
import { redirect } from 'next/navigation'
import { handleError } from '../utils'
import { connectToDatabase } from '../database/mongoose'
import Transaction from '../database/models/transaction.model'
import { updateCredits } from './user.actions'


export async function checkoutCredits(transaction: any) {
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: transaction.amount * 100, 
    currency: "INR",
    receipt: Math.random().toString(36).substring(7),
  };

  try {
    const order = await razorpay.orders.create(options);
    return { order };
  } catch (error) {
    handleError(error)
  }
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

export async function getAllTransactions() {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find();

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    handleError(error);
  }
}
