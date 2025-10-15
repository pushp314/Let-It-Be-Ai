import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createTransaction } from '@/lib/actions/transaction.action';

export async function POST(req: Request) {
  const body = await req.json();
  const sig = req.headers.get('x-razorpay-signature');

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!);
  shasum.update(JSON.stringify(body));
  const digest = shasum.digest('hex');

  if (digest === sig && body.event === 'payment.captured') {
    const transaction = {
      razorpayId: body.payload.payment.entity.id,
      razorpayOrderId: body.payload.payment.entity.order_id,
      amount: body.payload.payment.entity.amount / 100,
      plan: body.payload.payment.entity.notes.plan,
      credits: body.payload.payment.entity.notes.credits,
      buyerId: body.payload.payment.entity.notes.buyerId,
      createdAt: new Date(),
    };

    const newTransaction = await createTransaction(transaction);
    return NextResponse.json({ message: 'OK', transaction: newTransaction });
  }

  return new Response('Invalid signature', { status: 400 });
}