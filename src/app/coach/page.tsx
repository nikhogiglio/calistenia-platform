import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CoachPage() {
  const coach = await prisma.coachProfile.findFirst();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <div className="flex flex-col items-center text-center">
        {coach?.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coach.photoUrl}
            alt={coach.name}
            className="mb-6 h-32 w-32 rounded-full object-cover"
          />
        ) : (
          <div className="mb-6 h-32 w-32 rounded-full bg-charcoal" />
        )}
        <h1 className="text-2xl font-semibold uppercase tracking-wide">
          {coach?.name || "Coach"}
        </h1>
        {coach?.headline && (
          <p className="mt-1 text-xs uppercase tracking-widest text-bone/50">{coach.headline}</p>
        )}
      </div>

      <div className="mt-12 space-y-8">
        {coach?.bio && (
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Mi historia</h2>
            <p className="text-sm leading-relaxed text-bone/80">{coach.bio}</p>
          </div>
        )}
        {coach?.credentials && (
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-bone/50">Credenciales</h2>
            <p className="text-sm leading-relaxed text-bone/80">{coach.credentials}</p>
          </div>
        )}
        {coach?.instagram && (
          <div>
            <a
              href={coach.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/10"
            >
              Seguir en Instagram
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
