"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Exercise = {
  id: string;
  name: string;
  sets: string;
  repsTime: string;
  rest: string;
  videoUrl: string | null;
};
type Day = { id: string; title: string; exercises: Exercise[] };
type Level = {
  id: string;
  name: string;
  goals: string | null;
  experience: string | null;
  schedule: string | null;
  warmup: string | null;
  days: Day[];
};
type Program = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: number;
  imageUrl: string | null;
  published: boolean;
  levels: Level[];
};

const inputClass =
  "w-full rounded-lg border border-white/20 bg-graphite px-3 py-2 text-sm outline-none focus:border-bone/50";

export default function AdminProgramEditor({ initialProgram }: { initialProgram: Program }) {
  const router = useRouter();
  const [program, setProgram] = useState(initialProgram);
  const [status, setStatus] = useState("");
  const [activeLevel, setActiveLevel] = useState(0);

  function flash(msg: string) {
    setStatus(msg);
    setTimeout(() => setStatus(""), 1500);
  }

  async function saveProgram() {
    await fetch(`/api/admin/programs/${program.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: program.title,
        subtitle: program.subtitle,
        description: program.description,
        price: program.price,
        imageUrl: program.imageUrl,
        published: program.published,
      }),
    });
    flash("Guardado");
  }

  async function deleteProgram() {
    if (!confirm("¿Eliminar este programa por completo? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/admin/programs/${program.id}`, { method: "DELETE" });
    router.push("/admin");
  }

  async function saveLevel(level: Level) {
    await fetch(`/api/admin/levels/${level.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: level.name,
        goals: level.goals,
        experience: level.experience,
        schedule: level.schedule,
        warmup: level.warmup,
      }),
    });
    flash("Guardado");
  }

  function updateLevel(index: number, patch: Partial<Level>) {
    setProgram((p) => {
      const levels = [...p.levels];
      levels[index] = { ...levels[index], ...patch };
      return { ...p, levels };
    });
  }

  async function addDay(levelIndex: number) {
    const level = program.levels[levelIndex];
    const res = await fetch("/api/admin/days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levelId: level.id, title: `DAY ${level.days.length + 1}` }),
    });
    const day = await res.json();
    setProgram((p) => {
      const levels = [...p.levels];
      levels[levelIndex] = { ...levels[levelIndex], days: [...levels[levelIndex].days, { ...day, exercises: [] }] };
      return { ...p, levels };
    });
  }

  async function saveDay(levelIndex: number, dayIndex: number) {
    const day = program.levels[levelIndex].days[dayIndex];
    await fetch(`/api/admin/days/${day.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: day.title }),
    });
    flash("Guardado");
  }

  async function deleteDay(levelIndex: number, dayIndex: number) {
    const day = program.levels[levelIndex].days[dayIndex];
    if (!confirm("¿Eliminar este día y todos sus ejercicios?")) return;
    await fetch(`/api/admin/days/${day.id}`, { method: "DELETE" });
    setProgram((p) => {
      const levels = [...p.levels];
      levels[levelIndex] = {
        ...levels[levelIndex],
        days: levels[levelIndex].days.filter((_, i) => i !== dayIndex),
      };
      return { ...p, levels };
    });
  }

  function updateDay(levelIndex: number, dayIndex: number, patch: Partial<Day>) {
    setProgram((p) => {
      const levels = [...p.levels];
      const days = [...levels[levelIndex].days];
      days[dayIndex] = { ...days[dayIndex], ...patch };
      levels[levelIndex] = { ...levels[levelIndex], days };
      return { ...p, levels };
    });
  }

  async function addExercise(levelIndex: number, dayIndex: number) {
    const day = program.levels[levelIndex].days[dayIndex];
    const res = await fetch("/api/admin/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayId: day.id }),
    });
    const exercise = await res.json();
    setProgram((p) => {
      const levels = [...p.levels];
      const days = [...levels[levelIndex].days];
      days[dayIndex] = { ...days[dayIndex], exercises: [...days[dayIndex].exercises, exercise] };
      levels[levelIndex] = { ...levels[levelIndex], days };
      return { ...p, levels };
    });
  }

  function updateExercise(
    levelIndex: number,
    dayIndex: number,
    exIndex: number,
    patch: Partial<Exercise>
  ) {
    setProgram((p) => {
      const levels = [...p.levels];
      const days = [...levels[levelIndex].days];
      const exercises = [...days[dayIndex].exercises];
      exercises[exIndex] = { ...exercises[exIndex], ...patch };
      days[dayIndex] = { ...days[dayIndex], exercises };
      levels[levelIndex] = { ...levels[levelIndex], days };
      return { ...p, levels };
    });
  }

  async function saveExercise(levelIndex: number, dayIndex: number, exIndex: number) {
    const ex = program.levels[levelIndex].days[dayIndex].exercises[exIndex];
    await fetch(`/api/admin/exercises/${ex.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ex.name,
        sets: ex.sets,
        repsTime: ex.repsTime,
        rest: ex.rest,
        videoUrl: ex.videoUrl,
      }),
    });
    flash("Guardado");
  }

  async function deleteExercise(levelIndex: number, dayIndex: number, exIndex: number) {
    const ex = program.levels[levelIndex].days[dayIndex].exercises[exIndex];
    await fetch(`/api/admin/exercises/${ex.id}`, { method: "DELETE" });
    setProgram((p) => {
      const levels = [...p.levels];
      const days = [...levels[levelIndex].days];
      days[dayIndex] = {
        ...days[dayIndex],
        exercises: days[dayIndex].exercises.filter((_, i) => i !== exIndex),
      };
      levels[levelIndex] = { ...levels[levelIndex], days };
      return { ...p, levels };
    });
  }

  const level = program.levels[activeLevel];

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase tracking-wide">Editar programa</h1>
        {status && <span className="text-xs text-green-400">{status}</span>}
      </div>

      {/* Program info */}
      <div className="mb-10 space-y-4 rounded-2xl border border-white/10 bg-charcoal p-6">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">Título</label>
          <input
            className={inputClass}
            value={program.title}
            onChange={(e) => setProgram({ ...program, title: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">Subtítulo</label>
          <input
            className={inputClass}
            value={program.subtitle || ""}
            onChange={(e) => setProgram({ ...program, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">Descripción</label>
          <textarea
            className={inputClass}
            rows={3}
            value={program.description}
            onChange={(e) => setProgram({ ...program, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">
              Precio (USD)
            </label>
            <input
              type="number"
              className={inputClass}
              value={program.price / 100}
              onChange={(e) =>
                setProgram({ ...program, price: Math.round(Number(e.target.value) * 100) })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">
              URL de imagen de fondo
            </label>
            <input
              className={inputClass}
              value={program.imageUrl || ""}
              onChange={(e) => setProgram({ ...program, imageUrl: e.target.value })}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-bone/60">
          <input
            type="checkbox"
            checked={program.published}
            onChange={(e) => setProgram({ ...program, published: e.target.checked })}
          />
          Publicado (visible en la web)
        </label>
        <div className="flex gap-3">
          <button
            onClick={saveProgram}
            className="rounded-full bg-bone px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90"
          >
            Guardar
          </button>
          <button
            onClick={deleteProgram}
            className="rounded-full border border-red-500/40 px-6 py-2.5 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10"
          >
            Eliminar programa
          </button>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {program.levels.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActiveLevel(i)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${
              activeLevel === i ? "border-bone bg-bone text-ink" : "border-white/20 text-bone/60"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {level && (
        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-charcoal p-6">
            <input
              className={inputClass}
              value={level.name}
              onChange={(e) => updateLevel(activeLevel, { name: e.target.value })}
              placeholder="Nombre del nivel"
            />
            <textarea
              className={inputClass}
              rows={2}
              value={level.goals || ""}
              onChange={(e) => updateLevel(activeLevel, { goals: e.target.value })}
              placeholder="Training goals"
            />
            <textarea
              className={inputClass}
              rows={2}
              value={level.experience || ""}
              onChange={(e) => updateLevel(activeLevel, { experience: e.target.value })}
              placeholder="Recommended experience"
            />
            <textarea
              className={inputClass}
              rows={2}
              value={level.schedule || ""}
              onChange={(e) => updateLevel(activeLevel, { schedule: e.target.value })}
              placeholder="Weekly schedule"
            />
            <textarea
              className={inputClass}
              rows={2}
              value={level.warmup || ""}
              onChange={(e) => updateLevel(activeLevel, { warmup: e.target.value })}
              placeholder="Warm-up"
            />
            <button
              onClick={() => saveLevel(level)}
              className="rounded-full bg-bone px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90"
            >
              Guardar nivel
            </button>
          </div>

          {level.days.map((day, dayIndex) => (
            <div key={day.id} className="rounded-2xl border border-white/10 bg-charcoal p-6">
              <div className="mb-4 flex items-center gap-2">
                <input
                  className={inputClass}
                  value={day.title}
                  onChange={(e) => updateDay(activeLevel, dayIndex, { title: e.target.value })}
                />
                <button
                  onClick={() => saveDay(activeLevel, dayIndex)}
                  className="whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:bg-white/10"
                >
                  Guardar
                </button>
                <button
                  onClick={() => deleteDay(activeLevel, dayIndex)}
                  className="whitespace-nowrap rounded-full border border-red-500/40 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                >
                  Eliminar día
                </button>
              </div>

              <div className="space-y-3">
                {day.exercises.map((ex, exIndex) => (
                  <div key={ex.id} className="rounded-xl border border-white/5 bg-graphite/50 p-4">
                    <div className="grid gap-2 sm:grid-cols-5">
                      <input
                        className={inputClass}
                        value={ex.name}
                        onChange={(e) =>
                          updateExercise(activeLevel, dayIndex, exIndex, { name: e.target.value })
                        }
                        placeholder="Nombre"
                      />
                      <input
                        className={inputClass}
                        value={ex.sets}
                        onChange={(e) =>
                          updateExercise(activeLevel, dayIndex, exIndex, { sets: e.target.value })
                        }
                        placeholder="Sets"
                      />
                      <input
                        className={inputClass}
                        value={ex.repsTime}
                        onChange={(e) =>
                          updateExercise(activeLevel, dayIndex, exIndex, { repsTime: e.target.value })
                        }
                        placeholder="Reps/Time"
                      />
                      <input
                        className={inputClass}
                        value={ex.rest}
                        onChange={(e) =>
                          updateExercise(activeLevel, dayIndex, exIndex, { rest: e.target.value })
                        }
                        placeholder="Rest"
                      />
                      <input
                        className={inputClass}
                        value={ex.videoUrl || ""}
                        onChange={(e) =>
                          updateExercise(activeLevel, dayIndex, exIndex, { videoUrl: e.target.value })
                        }
                        placeholder="Link video"
                      />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveExercise(activeLevel, dayIndex, exIndex)}
                        className="rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-widest hover:bg-white/10"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => deleteExercise(activeLevel, dayIndex, exIndex)}
                        className="rounded-full border border-red-500/40 px-4 py-1.5 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addExercise(activeLevel, dayIndex)}
                  className="w-full rounded-xl border border-dashed border-white/20 py-3 text-xs uppercase tracking-widest text-bone/60 hover:bg-white/5"
                >
                  + Agregar ejercicio
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => addDay(activeLevel)}
            className="w-full rounded-2xl border border-dashed border-white/20 py-4 text-xs uppercase tracking-widest text-bone/60 hover:bg-white/5"
          >
            + Agregar día de entrenamiento
          </button>
        </div>
      )}
    </div>
  );
}
