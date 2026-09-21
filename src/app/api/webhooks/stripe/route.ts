import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const programId = session.metadata?.programId;

    if (userId && programId) {
      await prisma.purchase.upsert({
        where: { userId_programId: { userId, programId } },
        update: {
          status: "paid",
          stripeCheckoutSession: session.id,
          stripePaymentIntent:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
        create: {
          userId,
          programId,
          status: "paid",
          stripeCheckoutSession: session.id,
          stripePaymentIntent:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount: session.amount_total || 0,
          currency: (session.currency || "usd").toUpperCase(),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
