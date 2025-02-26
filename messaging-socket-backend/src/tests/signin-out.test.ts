import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../app";
import { io } from "../app";

const databaseUrl = process.env.TEST_DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

beforeAll(async () => {
  try {
    await prisma.message.deleteMany({});
    await prisma.usersInChat.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    console.error("Error in beforeAll:", error);
  }
});

afterAll(async () => {
  try {
    await prisma.usersInChat.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
    io.close();
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
});
describe("signin + signup routes", () => {
  it("User can sign up", async () => {
    const res = await request(app)
      .post("/signup")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
        expect(res.body.errors).toBeFalsy();
      });
  });

  it("User can sign in", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.username).not.toBeFalsy();
        expect(res.body.errors).toBeFalsy();
      });
  });

  it("Returns all signup validation errors", async () => {
    const body = {
      first_name: "max30".repeat(7),
      last_name: "max30".repeat(7),
      username: "",
      password: "",
      bio: "max255".repeat(43),
    };

    const res = await request(app)
      .post("/signup")
      .type("form")
      .send({
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        password: body.password,
        bio: body.bio,
      })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).toHaveLength(5);
      });
  });

  it("Returns error on existing username for signup", async () => {
    const res = await request(app)
      .post("/signup")
      .type("form")
      .send({
        username: "testing",
        password: "testing",
      })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Returns all signin validation errors", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({
        username: "",
        password: "",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toHaveLength(2);
      });
  });

  it("Returns error on non-existing user on signin", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({
        username: "henry",
        password: "ford",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });
});
