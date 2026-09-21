"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Coach = {
  name: string;
  headline: string | null;
  bio: string;
  photoUrl: string | null;
  credentials: string | null;
  instagram: string | null;
};

export default function AdminCoachPage() {
  const router = useRouter();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/coach")
      .then((r) => {
        if (r.status === 403) {
          router.push("/login?next=/admin/coach");
          throw new Error("no auth");
        }
        return r.json();
      })
      .then(setCoach)
      .catch(() => {});
  }, [router]);

  async function save() {
    if (!coach) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/coach", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coach),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!coach) return <div className="px-6 py-24 text-center text-sm text-bone/50">Cargando...</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="mb-8 text-2xl font-semibold uppercase tracking-wide">Editar página Coach</h1>

      <div className="space-y-4">
        <Field label="Nombre" value={coach.name} onChange={(v) => setCoach({ ...coach, name: v })} />
        <Field
          label="Titular / headline"
          value={coach.headline || ""}
          onChange={(v) => setCoach({ ...coach, headline: v })}
        />
        <Field
          label="URL de foto"
          value={coach.photoUrl || ""}
          onChange={(v) => setCoach({ ...coach, photoUrl: v })}
        />
        <TextArea
          label="Mi historia (bio)"
          value={coach.bio}
          onChange={(v) => setCoach({ ...coach, bio: v })}
        />
        <TextArea
          label="Credenciales"
          value={coach.credentials || ""}
          onChange={(v) => setCoach({ ...coach, credentials: v })}
        />
        <Field
          label="Link de Instagram"
          value={coach.instagram || ""}
          onChange={(v) => setCoach({ ...coach, instagram: v })}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-8 rounded-full bg-bone px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/20 bg-charcoal px-4 py-3 text-sm outline-none focus:border-bone/50"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-widest text-bone/50">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full rounded-lg border border-white/20 bg-charcoal px-4 py-3 text-sm outline-none focus:border-bone/50"
      />
    </div>
  );
}
