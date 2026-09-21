"use client";

import { useState } from "react";
import Link from "next/link";

type Exercise = {
  id: string;
  name: string;
  sets: string;
  repsTime: string;
  rest: string;
  videoUrl: string | null;
  notes: string | null;
};

type Day = {
  id: string;
  title: string;
  exercises: Exercise[];
};

type Level = {
  id: string;
  name: string;
  goals: string;
  experience: string;
  schedule: string;
  warmup: string;
  days: Day[];
};

type Program = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  levels: Level[];
};

export default function ProgramView({
  program,
  hasAccess,
  isLoggedIn,
}: {
  program: Program;
  hasAccess: boolean;
  isLoggedIn: boolean;
}) {
  const [activeLevel, setActiveLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const level = program.levels[activeLevel];
  const priceLabel = `$${(program.price / 100).toFixed(0)}`;

  async function handleBuy() {
    setError(null);
    if (!isLoggedIn) {
      window.location.href = `/login?next=/programas/${program.slug}`;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId: program.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "No se pudo iniciar el pago.");
      }
    } catch (e) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="mb-8 inline-block text-xs uppercase tracking-widest text-bone/50 hover:text-bone">
        ← Volver
      </Link>

      <h1 className="mb-2 text-3xl font-semibold uppercase tracking-wide">{program.title}</h1>
      <p className="mb-6 text-sm uppercase tracking-widest text-bone/50">{program.subtitle}</p>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-bone/70">{program.description}</p>

      {!hasAccess && (
        <div className="mb-12 flex items-center gap-4 rounded-xl border border-white/10 bg-charcoal p-6">
          <div className="flex-1">
            <p className="text-2xl font-semibold">{priceLabel}</p>
            <p className="text-xs text-bone/50">Acceso completo a los 3 niveles</p>
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="rounded-full bg-bone px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:bg-white disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Comprar ahora"}
          </button>
        </div>
      )}
      {error && <p className="mb-8 text-sm text-red-400">{error}</p>}

      <div className="mb-8 flex gap-2">
        {program.levels.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActiveLevel(i)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
              activeLevel === i
                ? "border-bone bg-bone text-ink"
                : "border-white/20 text-bone/60 hover:border-white/40"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {level && (
        <div className="space-y-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-charcoal p-5">
              <h3 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Objetivos</h3>
              <p className="text-sm text-bone/80">{level.goals}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-charcoal p-5">
              <h3 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Experiencia recomendada</h3>
              <p className="text-sm text-bone/80">{level.experience}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-charcoal p-5">
              <h3 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Horario semanal</h3>
              <p className="text-sm text-bone/80">{level.schedule}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-charcoal p-5">
              <h3 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Calentamiento</h3>
              <p className="text-sm text-bone/80">{level.warmup}</p>
            </div>
          </div>

          {hasAccess ? (
            <div className="space-y-8">
              {level.days.map((day) => (
                <div key={day.id}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest">{day.title}</h3>
                  <div className="space-y-2">
                    {day.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-charcoal px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{ex.name}</p>
                          <p className="text-xs text-bone/50">
                            {ex.sets} series · {ex.repsTime} · descanso {ex.rest}
                          </p>
                        </div>
                        {ex.videoUrl && (
                          <a
                            href={ex.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-widest text-bone underline"
                          >
                            Ver video
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-sm text-bone/50">
              Compra el programa para desbloquear los días y ejercicios de este nivel.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
