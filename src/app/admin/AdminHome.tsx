"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Program = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  price: number;
  published: boolean;
};

export default function AdminHome({ programs }: { programs: Program[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function createProgram() {
    setCreating(true);
    const res = await fetch("/api/admin/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Nuevo programa", price: 0 }),
    });
    const data = await res.json();
    setCreating(false);
    router.push(`/admin/programas/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase tracking-wide">Panel de administrador</h1>
        <Link
          href="/admin/coach"
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-widest hover:bg-white/10"
        >
          Editar página Coach
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-widest text-bone/50">Programas</h2>
        <button
          onClick={createProgram}
          disabled={creating}
          className="rounded-full bg-bone px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90"
        >
          {creating ? "Creando..." : "+ Nuevo programa"}
        </button>
      </div>

      <div className="space-y-3">
        {programs.map((p) => (
          <Link
            key={p.id}
            href={`/admin/programas/${p.id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal px-5 py-4 hover:border-white/30"
          >
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-bone/50">{p.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-bone/70">${(p.price / 100).toFixed(0)}</span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                  p.published ? "bg-green-500/20 text-green-300" : "bg-white/10 text-bone/50"
                }`}
              >
                {p.published ? "Publicado" : "Oculto"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
