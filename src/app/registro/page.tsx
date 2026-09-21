"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarte.");

      const signInRes = await signIn("credentials", { redirect: false, email, password });
      if (signInRes?.error) throw new Error("Cuenta creada, pero no se pudo iniciar sesión.");

      router.push(next);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-6">
      <h1 className="mb-8 text-center text-2xl font-semibold uppercase tracking-wide">
        Crear cuenta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-white/20 bg-charcoal px-4 py-3 text-sm outline-none focus:border-bone/50"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-white/20 bg-charcoal px-4 py-3 text-sm outline-none focus:border-bone/50"
        />
        <input
          type="password"
          placeholder="Contraseña (mín. 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-white/20 bg-charcoal px-4 py-3 text-sm outline-none focus:border-bone/50"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-bone py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-bone/50">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-bone underline">
          Ingresa
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
