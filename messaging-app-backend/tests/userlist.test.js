const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const bcrypt = require("bcryptjs");
let token;

beforeAll(async () => {
  await initializeMongoServer();

  const password = "testing";
  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const users = new Usermodel({
        first_name: "Test",
        last_name: "test",
        username: "testing",
        password: hashedPassword,
        age: 14,
        bio: "I am new here testing things out",
      });

      await users.save();
    });
  } catch (err) {
    console.log(err);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);

test("User can sign in", async () => {
  const payload = { username: "testing", password: "testing" };

  const res = await request(app)
    .post("/user/signin")
    .send(payload)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .then((res) => {
      expect(res.body.username).toEqual("testing");
      expect(res.body.token).not.toBeNull();
      token = res.body.token;
    });
});

test("Returns the user list", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get("/user/userlist")
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.body.users[0].username).toBe("testing");
    });
});

test("Returns a server error without authentication", async () => {
  const res = await request(app)
    .get("/user/userlist")
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
