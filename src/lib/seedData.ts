import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

type ExerciseSeed = {
  name: string;
  sets: string;
  repsTime: string;
  rest: string;
  videoUrl?: string;
};

type DaySeed = { title: string; exercises: ExerciseSeed[] };

type LevelSeed = {
  name: string;
  goals: string;
  experience: string;
  schedule: string;
  warmup: string;
  days: DaySeed[];
};

type ProgramSeed = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  imageUrl: string;
  order: number;
  levels: LevelSeed[];
};

function placeholderDay(title: string): DaySeed {
  return {
    title,
    exercises: [
      { name: "Ejercicio de ejemplo 1", sets: "3", repsTime: "10 reps", rest: "60s" },
      { name: "Ejercicio de ejemplo 2", sets: "3", repsTime: "30s", rest: "45s" },
      { name: "Ejercicio de ejemplo 3", sets: "4", repsTime: "8 reps", rest: "90s" },
    ],
  };
}

function baseLevel(name: string): LevelSeed {
  return {
    name,
    goals: "Editar desde el panel de administrador: objetivos de este nivel.",
    experience: "Editar desde el panel de administrador: experiencia recomendada.",
    schedule: "Editar desde el panel de administrador: horario semanal sugerido.",
    warmup: "Editar desde el panel de administrador: rutina de calentamiento.",
    days: [
      placeholderDay("DAY 1 — PUSH"),
      placeholderDay("DAY 2 — PULL"),
      placeholderDay("DAY 3 — LEGS & CORE"),
    ],
  };
}

const programs: ProgramSeed[] = [
  {
    slug: "ponte-fuerte-en-casa",
    title: "PONTE FUERTE EN CASA",
    subtitle: "Functional Training",
    description:
      "Programa de entrenamiento funcional para hacer en casa, sin necesidad de equipo especializado. Ideal para construir una base sólida de fuerza real.",
    price: 3000,
    imageUrl: "",
    order: 1,
    levels: [
      baseLevel("LEVEL 1 — BEGINNER"),
      baseLevel("LEVEL 2 — ADVANCED"),
      baseLevel("LEVEL 3 — PRO"),
    ],
  },
  {
    slug: "sets-and-reps",
    title: "SETS & REPS",
    subtitle: "Calisthenics Park Training",
    description:
      "Entrena en el parque de calistenia con un sistema progresivo de sets y reps para dominar tu propio peso corporal.",
    price: 4000,
    imageUrl: "",
    order: 2,
    levels: [
      baseLevel("LEVEL 1 — BEGINNER"),
      baseLevel("LEVEL 2 — ADVANCED"),
      baseLevel("LEVEL 3 — PRO"),
    ],
  },
  {
    slug: "static-skills",
    title: "STATIC SKILLS",
    subtitle: "Planche & Front Lever",
    description:
      "Programa especializado para dominar las habilidades estáticas más exigentes de la calistenia: planche y front lever.",
    price: 5000,
    imageUrl: "",
    order: 3,
    levels: [
      baseLevel("LEVEL 1 — BEGINNER"),
      baseLevel("LEVEL 2 — ADVANCED"),
      baseLevel("LEVEL 3 — PRO"),
    ],
  },
];

export async function seedDatabase(prisma: PrismaClient) {
  const adminEmail = (process.env.ADMIN_EMAIL || "nikholasgiglio15@gmail.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "CambiarEstaClave123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Nikholas",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const p of programs) {
    const program = await prisma.program.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        order: p.order,
      },
    });

    for (let li = 0; li < p.levels.length; li++) {
      const l = p.levels[li];
      const level = await prisma.level.upsert({
        where: { programId_order: { programId: program.id, order: li } },
        update: {},
        create: {
          programId: program.id,
          name: l.name,
          order: li,
          goals: l.goals,
          experience: l.experience,
          schedule: l.schedule,
          warmup: l.warmup,
        },
      });

      for (let di = 0; di < l.days.length; di++) {
        const d = l.days[di];
        const day = await prisma.day.upsert({
          where: { levelId_order: { levelId: level.id, order: di } },
          update: {},
          create: {
            levelId: level.id,
            title: d.title,
            order: di,
          },
        });

        for (let ei = 0; ei < d.exercises.length; ei++) {
          const e = d.exercises[ei];
          const existing = await prisma.exercise.findFirst({
            where: { dayId: day.id, order: ei },
          });
          if (!existing) {
            await prisma.exercise.create({
              data: {
                dayId: day.id,
                name: e.name,
                sets: e.sets,
                repsTime: e.repsTime,
                rest: e.rest,
                videoUrl: e.videoUrl || null,
                order: ei,
              },
            });
          }
        }
      }
    }
  }

  const existingCoach = await prisma.coachProfile.findFirst();
  if (!existingCoach) {
    await prisma.coachProfile.create({
      data: {
        name: "Nikholas",
        headline: "Coach de calistenia",
        bio: "Editar esta biografía desde el panel de administrador: tu historia, cómo empezaste, y por qué entrenas calistenia.",
        photoUrl: "",
        credentials: "Editar desde el panel: certificaciones, logros, años de experiencia.",
        instagram: "",
      },
    });
  }

  return { adminEmail };
}
