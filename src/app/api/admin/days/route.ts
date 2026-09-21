import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const { levelId, title } = body;
  if (!levelId) return NextResponse.json({ error: "Falta el nivel." }, { status: 400 });

  const count = await prisma.day.count({ where: { levelId } });

  const day = await prisma.day.create({
    data: {
      levelId,
      title: title || `DAY ${count + 1}`,
      order: count,
    },
  });

  return NextResponse.json(day);
}
