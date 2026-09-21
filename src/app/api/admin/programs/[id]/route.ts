import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      levels: {
        orderBy: { order: "asc" },
        include: {
          days: {
            orderBy: { order: "asc" },
            include: { exercises: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });
  if (!program) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json(program);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const data: any = {};
  for (const key of ["title", "subtitle", "description", "imageUrl", "published"]) {
    if (key in body) data[key] = body[key];
  }
  if ("price" in body) data.price = Number(body.price);

  const program = await prisma.program.update({ where: { id: params.id }, data });
  return NextResponse.json(program);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.program.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
