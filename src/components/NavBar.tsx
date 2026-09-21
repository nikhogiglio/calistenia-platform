"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/coach", label: "Coach" },
];

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold uppercase tracking-widest">
          Calistenia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-widest transition ${
                pathname === l.href ? "text-bone" : "text-bone/50 hover:text-bone"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone">
              Admin
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/cuenta" className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone">
                Mi cuenta
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone">
              Ingresar
            </Link>
          )}
        </nav>

        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span className="h-px w-5 bg-bone" />
          <span className="h-px w-5 bg-bone" />
          <span className="h-px w-5 bg-bone" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-ink px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-xs uppercase tracking-widest text-bone/70"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="py-2 text-xs uppercase tracking-widest text-bone/70">
              Admin
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/cuenta" onClick={() => setOpen(false)} className="py-2 text-xs uppercase tracking-widest text-bone/70">
                Mi cuenta
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="py-2 text-left text-xs uppercase tracking-widest text-bone/70"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="py-2 text-xs uppercase tracking-widest text-bone/70">
              Ingresar
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
