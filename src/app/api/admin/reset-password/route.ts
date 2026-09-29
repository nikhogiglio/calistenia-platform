import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const newPassword = url.searchParams.get("password");

if (!process.env.BOOTSTRAP_SECRET || secret !== process.env.BOOTSTRAP_SECRET) {
  return NextResponse.json({ error: "No autorizado." }, { status: 403 });
}

if (!newPassword || newPassword.length < 6) {
  return NextResponse.json({ error: "Password invalida." }, { status: 400 });
}

try {
  const adminEmail = (process.env.ADMIN_EMAIL || "nikholasgiglio15@gmail.com").toLowerCase().trim();
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: adminEmail },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
} catch (err) {
  console.error(err);
  return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
}
}
