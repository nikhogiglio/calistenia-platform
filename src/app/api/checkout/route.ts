import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const programId = body?.programId as string | undefined;
  if (!programId) {
    return NextResponse.json({ error: "Falta el programa." }, { status: 400 });
  }

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program || !program.published) {
    return NextResponse.json({ error: "Programa no encontrado." }, { status: 404 });
  }

  const existing = await prisma.purchase.findUnique({
    where: { userId_programId: { userId: session.user.id, programId: program.id } },
  });
  if (existing?.status === "paid") {
    return NextResponse.json({ error: "Ya compraste este programa." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: program.currency.toLowerCase(),
          product_data: { name: program.title, description: program.subtitle },
          unit_amount: program.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/programas/${program.slug}?success=1`,
    cancel_url: `${appUrl}/programas/${program.slug}?canceled=1`,
    metadata: {
      userId: session.user.id,
      programId: program.id,
    },
  });

  await prisma.purchase.upsert({
    where: { userId_programId: { userId: session.user.id, programId: program.id } },
    update: {
      stripeCheckoutSession: checkoutSession.id,
      amount: program.price,
      currency: program.currency,
      status: "pending",
    },
    create: {
      userId: session.user.id,
      programId: program.id,
      stripeCheckoutSession: checkoutSession.id,
      amount: program.price,
      currency: program.currency,
      status: "pending",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
