import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const data: any = {};
  for (const key of ["name", "goals", "experience", "schedule", "warmup"]) {
    if (key in body) data[key] = body[key];
  }

  const level = await prisma.level.update({ where: { id: params.id }, data });
  return NextResponse.json(level);
}
