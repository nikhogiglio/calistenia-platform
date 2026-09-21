import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProgramView from "./ProgramView";

export const dynamic = "force-dynamic";

export default async function ProgramPage({ params }: { params: { slug: string } }) {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug },
    include: {
      levels: {
        orderBy: { order: "asc" },
        include: { days: { orderBy: { order: "asc" }, include: { exercises: { orderBy: { order: "asc" } } } } },
      },
    },
  });
  if (!program || !program.published) notFound();

  const session = await getServerSession(authOptions);
  let hasAccess = false;
  if (session?.user) {
    const purchase = await prisma.purchase.findUnique({
      where: { userId_programId: { userId: session.user.id, programId: program.id } },
    });
    hasAccess = purchase?.status === "paid";
  }

  return (
    <Suspense>
      <ProgramView program={JSON.parse(JSON.stringify(program))} hasAccess={hasAccess} isLoggedIn={!!session?.user} />
    </Suspense>
  );
}
