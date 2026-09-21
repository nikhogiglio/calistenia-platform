import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const data: any = {};
  if ("title" in body) data.title = body.title;

  const day = await prisma.day.update({ where: { id: params.id }, data });
  return NextResponse.json(day);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.day.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
