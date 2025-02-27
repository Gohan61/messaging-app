import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const uuidMessage = uuidv4();

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

  const chat2 = await prisma.chat.upsert({
    where: { sid: "2" },
    update: {},
    create: {
      sid: "2",
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

  const message = await prisma.message.upsert({
    where: { id: uuidMessage },
    update: {},
    create: {
      id: uuidMessage,
      message: "Hello",
      timestamp: "2020-03-01",
      chat: {
        connect: {
          sid: "2",
        },
      },
      owner: {
        connect: {
          username: "testing",
        },
      },
    },
  });
}
