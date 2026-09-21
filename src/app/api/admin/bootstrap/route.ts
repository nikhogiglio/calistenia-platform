import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seedData";

// Ruta de un solo uso para inicializar la base de datos (admin + programas)
// sin necesidad de acceso a terminal. Protegida por BOOTSTRAP_SECRET.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    const result = await seedDatabase(prisma);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Error al inicializar." }, { status: 500 });
  }
}
