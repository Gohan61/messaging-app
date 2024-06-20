const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const initializeMongoServer = require("../config/databaseTest");
const Usermodel = require("../models/user");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);

test("User can signup", async () => {
  const payload = {
    first_name: "Hans",
    last_name: "Peter",
    username: "Hpeter",
    password: "testing",
    age: 12,
    bio: "I am new here testing things out",
  };

  const res = await request(app)
    .post("/user/signup")
    .send(payload)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .then((res) => {
      expect(res.body).toEqual({ message: "You are signed up" });
    });
});

test("Throws validation error", async () => {
  const payload = {
    first_name: "H",
    last_name: "Peter",
    username: "Hpeter",
    password: "testing",
    age: 12,
    bio: "I am new here testing things out",
  };

  const res = await request(app)
    .post("/user/signup")
    .send(payload)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .then((res) => {
      expect(res.body.errors.errors[0].msg).toEqual(
        "First name must be between 2 and 50 characters",
      );
    });
});
