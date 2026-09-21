import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const programs = await prisma.program.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const body = await req.json();
  const slug = (body.slug || body.title || "programa")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const count = await prisma.program.count();

  const program = await prisma.program.create({
    data: {
      slug: `${slug}-${Date.now().toString(36)}`,
      title: body.title || "Nuevo programa",
      subtitle: body.subtitle || "",
      description: body.description || "",
      price: Number(body.price) || 0,
      imageUrl: body.imageUrl || "",
      order: count,
      levels: {
        create: [
          { name: "LEVEL 1 — BEGINNER", order: 0 },
          { name: "LEVEL 2 — ADVANCED", order: 1 },
          { name: "LEVEL 3 — PRO", order: 2 },
        ],
      },
    },
  });

  return NextResponse.json(program);
}
