import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function seed() {
  const testUser = await prisma.user.upsert({
    where: { username: "testing" },
    update: {},
    create: {
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
      username: "testing2",
      password: await bcrypt.hash("testing2", 10),
      first_name: "testing2",
      last_name: "testing2",
      bio: "testing2",
    },
  });

  // Needed because the syncing to DB is not instant
  // leading to chat creation failing because the user
  // does not exist in the DB yet
  await delay(1000);

  const chat1 = await prisma.chat.upsert({
    where: { sid: "1" },
    update: {},
    create: {
      sid: "1",
      date: "01-01-2021",
      owner: {
        connect: {
          username: "testing",
        },
      },
      usersInChat: {
        create: [
          {
            user: {
              connect: {
                username: "testing2",
              },
            },
          },
          {
            user: {
              connect: {
                username: "testing",
              },
            },
          },
        ],
      },
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
