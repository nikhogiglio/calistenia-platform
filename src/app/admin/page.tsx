import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminHome from "./AdminHome";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=/admin");

  const programs = await prisma.program.findMany({ orderBy: { order: "asc" } });

  return <AdminHome programs={JSON.parse(JSON.stringify(programs))} />;
}
