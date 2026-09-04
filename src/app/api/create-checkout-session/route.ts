import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { invoiceNumber, totalAmount } = body as {
    invoiceNumber?: string;
    totalAmount?: number;
  };

  if (!invoiceNumber || !totalAmount || totalAmount <= 0) {
    return NextResponse.json(
      { error: "invoiceNumber and a positive totalAmount are required." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secretKey);
  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(totalAmount * 100),
          product_data: {
            name: `Invoice ${invoiceNumber}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/?payment=success&invoice=${encodeURIComponent(invoiceNumber)}`,
    cancel_url: `${origin}/?payment=cancelled&invoice=${encodeURIComponent(invoiceNumber)}`,
  });

  return NextResponse.json({ url: session.url });
}
