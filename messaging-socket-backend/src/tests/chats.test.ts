import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../app";
import { io } from "../app";
import { seed } from "../config/seed";

const databaseUrl = process.env.TEST_DATABASE_URL;
let JWTToken: string;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

beforeAll(async () => {
  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.user.deleteMany({});

  await seed();

  const res = await request(app)
    .post("/signin")
    .type("form")
    .send({ username: "testing", password: "testing" });

  JWTToken = res.body.token;
});

afterAll(async () => {
  await prisma.usersInChat.deleteMany({});
  io.close();
});

describe("new chat route", () => {
  it("Returns message on successful message creation", async () => {
    const body = {
      recipientUsername: "testing2",
      ownerUsername: "testing",
    };

    const res = await request(app)
      .post("/chat/new")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
        expect(res.body.errors).toBeFalsy();
      });
  });

  it("Returns validation errors", async () => {
    const body = {
      recipientUsername: "",
      ownerUsername: "",
    };

    const res = await request(app)
      .post("/chat/new")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).not.toBeFalsy();
      });
  });

  it("Returns authorization error", async () => {
    const res = await request(app)
      .post("/chat/new")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });

  it("Returns error on failing to create new chat", async () => {
    const body = {
      recipientUsername: "peter",
      ownerUsername: "hans",
    };

    const res = await request(app)
      .post("/chat/new")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });
});
