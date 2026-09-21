import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const { dayId } = body;
  if (!dayId) return NextResponse.json({ error: "Falta el día." }, { status: 400 });

  const count = await prisma.exercise.count({ where: { dayId } });

  const exercise = await prisma.exercise.create({
    data: {
      dayId,
      name: body.name || "Nuevo ejercicio",
      sets: body.sets || "3",
      repsTime: body.repsTime || "10 reps",
      rest: body.rest || "60s",
      videoUrl: body.videoUrl || null,
      order: count,
    },
  });

  return NextResponse.json(exercise);
}
