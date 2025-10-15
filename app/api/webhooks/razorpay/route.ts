
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createTransaction } from '@/lib/actions/transaction.action';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get('x-razorpay-signature');

  if (!sig) {
    return new Response('Webhook signature not found', { status: 400 });
  }

  const shasum = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET);
  shasum.update(rawBody);
  const digest = shasum.digest('hex');

  if (digest !== sig) {
    return new Response('Invalid signature', { status: 400 });
  }

  const body = JSON.parse(rawBody);

  if (body.event === 'payment.captured') {
    const transaction = {
      razorpayId: body.payload.payment.entity.id,
      razorpayOrderId: body.payload.payment.entity.order_id,
      amount: body.payload.payment.entity.amount / 100,
      plan: body.payload.payment.entity.notes.plan,
      credits: body.payload.payment.entity.notes.credits,
      buyerId: body.payload.payment.entity.notes.buyerId,
      createdAt: new Date(),
    };

    try {
      const newTransaction = await createTransaction(transaction);
      return NextResponse.json({ message: 'OK', transaction: newTransaction });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return new Response('Error processing transaction', { status: 500 });
    }
  }

  return NextResponse.json({ message: 'OK' });
}
