const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const initializeMongoServer = require("../config/databaseTest");
const Usermodel = require("../models/user");
require("dotenv").config();

beforeAll(async () => {
  await initializeMongoServer();

  const users = new Usermodel({
    first_name: "Test",
    last_name: "test",
    username: "testing",
    password: "testing",
    age: 12,
    bio: "I am new here testing things out",
  });

  users.save();
});

app.use("/user", user);

test("Returns the user list", async () => {
  const authorization = {
    Authorization: process.env.testToken,
  };

  const res = await request(app)
    .get("/user/userlist")
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.users).not.toBeNull();
    });
});

test("Returns a server error without authentication", async () => {
  const res = await request(app)
    .get("/user/userlist")
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(500);
    });
});
