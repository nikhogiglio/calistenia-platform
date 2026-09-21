import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const coach = await prisma.coachProfile.findFirst();
  return NextResponse.json(coach);
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const existing = await prisma.coachProfile.findFirst();

  const data: any = {};
  for (const key of ["name", "headline", "bio", "photoUrl", "credentials", "instagram"]) {
    if (key in body) data[key] = body[key];
  }

  const coach = existing
    ? await prisma.coachProfile.update({ where: { id: existing.id }, data })
    : await prisma.coachProfile.create({ data: { name: "Coach", bio: "", ...data } });

  return NextResponse.json(coach);
}
