import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?next=/cuenta");

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, status: "paid" },
    include: { program: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="mb-2 text-2xl font-semibold uppercase tracking-wide">Mi cuenta</h1>
      <p className="mb-10 text-sm text-bone/50">{session.user.email}</p>
      <h2 className="mb-4 text-xs uppercase tracking-widest text-bone/50">Mis programas</h2>
      {purchases.length === 0 ? (
        <p className="text-sm text-bone/60">Aún no has comprado ningún programa.</p>
      ) : (
        <div className="space-y-3">
          {purchases.map((p) => (
            <Link key={p.id} href={`/programas/${p.program.slug}`} className="block rounded-xl border border-white/10 bg-charcoal px-5 py-4 hover:border-white/30">
              <p className="text-sm font-medium">{p.program.title}</p>
              <p className="text-xs text-bone/50">{p.program.subtitle}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
