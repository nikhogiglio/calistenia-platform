import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const programs = await prisma.program.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-widest2 text-bone/50">
          Entrenamiento con tu propio peso
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold uppercase leading-tight tracking-tight md:text-6xl">
          Fuerza real,
          <br />
          construida con disciplina
        </h1>
        <p className="mt-6 max-w-md text-sm text-bone/60">
          Programas de calistenia estructurados por niveles. Entrena en casa, en el parque, o
          alcanza las habilidades estáticas más exigentes.
        </p>
        <a
          href="#programas"
          className="mt-10 rounded-full border border-bone/30 px-8 py-3 text-xs uppercase tracking-widest hover:bg-bone hover:text-ink transition"
        >
          Ver programas
        </a>
      </section>

      <section id="programas" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.id}
              href={`/programas/${p.slug}`}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-charcoal p-6"
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:opacity-40"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-graphite to-ink" />
              )}
              <div className="relative z-10">
                <p className="mb-2 text-[11px] uppercase tracking-widest text-bone/60">
                  {p.subtitle}
                </p>
                <h3 className="text-2xl font-semibold uppercase leading-tight">{p.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-bone/80">
                    ${(p.price / 100).toFixed(0)}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-bone/60 group-hover:text-bone">
                    Ver programa →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
