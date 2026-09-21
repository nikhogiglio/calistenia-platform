import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seedData";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .then(({ adminEmail }) => {
    console.log(`Seed completo. Admin: ${adminEmail}`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
