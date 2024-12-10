import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function seed() {
  const testUser = await prisma.user.upsert({
    where: { username: "testing" },
    update: {},
    create: {
      id: 1,
      username: "testing",
      password: await bcrypt.hash("testing", 10),
      first_name: "testing",
      last_name: "testing",
      bio: "testing",
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { username: "testing2" },
    update: {},
    create: {
      id: 2,
      username: "testing2",
      password: await bcrypt.hash("testing2", 10),
      first_name: "testing2",
      last_name: "testing2",
      bio: "testing2",
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
