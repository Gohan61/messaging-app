import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../app";
import { seed } from "../config/seed";
import { io } from "../app";

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
  try {
    await prisma.message.deleteMany({});
    await prisma.usersInChat.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});

    await seed();

    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" });

    JWTToken = res.body.token;
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

describe("new chat route", () => {
  it("Returns message on successful message creation", async () => {
    const body = {
      recipientUsername: "testing2",
      ownerUsername: "testing",
    };

    const res = await request(app)
      .post("/chat/new/chat")
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
      .post("/chat/new/chat")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).toHaveLength(2);
      });
  });

  it("Returns authorization error", async () => {
    const res = await request(app)
      .post("/chat/new/chat")
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
      .post("/chat/new/chat")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });
});

describe("new message route", () => {
  it("Returns message on successful message creation", async () => {
    const body = {
      chatSid: "1",
      ownerUsername: "testing",
      recipientUsername: "testing2",
      message: "Hello",
    };

    const res = await request(app)
      .post("/chat/new/message")
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
      chatSid: "",
      ownerUsername: "",
      recipientUsername: "",
      message: "",
    };

    const res = await request(app)
      .post("/chat/new/message")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).toHaveLength(4);
      });
  });

  it("Returns no chat found error", async () => {
    const body = {
      chatSid: "2",
      ownerUsername: "testing",
      recipientUsername: "testing2",
      message: "Hello",
    };

    const res = await request(app)
      .post("/chat/new/message")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Returns error on failing to create new message", async () => {
    const body = {
      chatSid: "1",
      ownerUsername: "hans",
      recipientUsername: "testing2",
      message: "Hello",
    };

    const res = await request(app)
      .post("/chat/new/message")
      .set("Authorization", `Bearer ${JWTToken}`)
      .type("form")
      .send(body)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });
});

describe("Get all chats route", () => {
  it("Returns all chats", async () => {
    const res = await request(app)
      .get("/chat/all/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.errors).toBeFalsy();
      });
  });

  it("Returns error for non-existing user", async () => {
    const res = await request(app)
      .get("/chat/all/henry")
      .set("Authorization", `Bearer ${JWTToken}`)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });
});
