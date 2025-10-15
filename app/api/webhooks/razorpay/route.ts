import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createTransaction } from "@/lib/actions/transaction.action";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("x-razorpay-signature") as string;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(body);
  const digest = shasum.digest("hex");

  if (digest !== sig) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const { entity } = event.payload.payment;
    const transaction = {
      razorpayId: entity.id,
      amount: entity.amount / 100,
      plan: entity.notes.plan,
      credits: entity.notes.credits,
      buyerId: entity.notes.buyerId,
      createdAt: new Date(),
    };

    const newTransaction = await createTransaction(transaction);

    return NextResponse.json({ message: "OK", transaction: newTransaction });
  }

  return NextResponse.json({ message: "OK" });
}
