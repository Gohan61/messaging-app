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
  io.close();
});

describe("user routes", () => {
  it("Returns user profile", async () => {
    const res = await request(app)
      .get("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.user).not.toBeFalsy();
        expect(res.body.errorMessage).toBeFalsy();
      });
  });

  it("Returns error on non-existing user", async () => {
    const res = await request(app)
      .get("/user/henry")
      .set("Authorization", `Bearer ${JWTToken}`)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Returns list of all users", async () => {
    const res = await request(app)
      .get("/user/list")
      .set("Authorization", `Bearer ${JWTToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.allUsers).toHaveLength(2);
      });
  });

  it("Returns validation errors on update user route", async () => {
    const body = {
      first_name: "max30".repeat(7),
      last_name: "max30".repeat(7),
      username: "",
      password: "",
      bio: "max255".repeat(43),
    };

    const res = await request(app)
      .put("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({
        first_name: body.first_name,
        last_name: body.last_name,
        oldUsername: body.username,
        newUsername: body.username,
        oldPassword: body.password,
        bio: body.bio,
      })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).toHaveLength(6);
      });
  });

  it("Returns error on non-existing user update route", async () => {
    const res = await request(app)
      .put("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({
        oldUsername: "henry",
        newUsername: "henry",
        oldPassword: "henry",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Returns error on wrong password user update route", async () => {
    const res = await request(app)
      .put("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({
        oldUsername: "testing",
        newUsername: "henry",
        oldPassword: "henry",
      })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Updates user details", async () => {
    const body = {
      first_name: "henry",
      last_name: "henry",
      username: "testing2",
      newUsername: "henry",
      password: "testing2",
      newPassword: "henry",
      bio: "henry",
    };

    const res = await request(app)
      .put("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({
        first_name: body.first_name,
        last_name: body.last_name,
        oldUsername: body.username,
        newUsername: body.newUsername,
        oldPassword: body.password,
        newPassword: body.newPassword,
        bio: body.bio,
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
        expect(res.body.errors).toBeFalsy();
        expect(res.body.errorMessage).toBeFalsy();
      });
  });

  it("Returns error on existing username update user route", async () => {
    const body = {
      first_name: "henry",
      last_name: "henry",
      username: "testing",
      newUsername: "henry",
      password: "testing",
      newPassword: "henry",
      bio: "henry",
    };

    const res = await request(app)
      .put("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({
        first_name: body.first_name,
        last_name: body.last_name,
        oldUsername: body.username,
        newUsername: body.newUsername,
        oldPassword: body.password,
        newPassword: body.newPassword,
        bio: body.bio,
      })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Returns validation error on delete user route", async () => {
    const res = await request(app)
      .delete("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({ password: "" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing user delete user route", async () => {
    const res = await request(app)
      .delete("/user/manfried")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({ password: "uwe" })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errorMessage).not.toBeFalsy;
      });
  });

  it("Returns error on wrong password delete user route", async () => {
    const res = await request(app)
      .delete("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({ password: "henry" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errorMessage).not.toBeFalsy();
      });
  });

  it("Deletes users", async () => {
    const res = await request(app)
      .delete("/user/testing")
      .set("Authorization", `Bearer ${JWTToken}`)
      .send({ password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
        expect(res.body.errors).toBeFalsy();
      });
  });
});
