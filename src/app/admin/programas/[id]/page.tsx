import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminProgramEditor from "./AdminProgramEditor";

export const dynamic = "force-dynamic";

export default async function AdminProgramPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) redirect(`/login?next=/admin/programas/${params.id}`);

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

  if (!program) redirect("/admin");

  return <AdminProgramEditor initialProgram={JSON.parse(JSON.stringify(program))} />;
}
