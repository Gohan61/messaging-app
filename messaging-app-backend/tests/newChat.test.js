const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const chat = require("../routes/chats");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const bcrypt = require("bcryptjs");
let token;
const user1Id = "621ff30d2a3e781873fcb663";
const user2Id = "621ff30d2a3e781873fcb664";

beforeAll(async () => {
  await initializeMongoServer();

  const password = "testing";
  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user1 = new Usermodel({
        first_name: "Test",
        last_name: "test",
        username: "testing",
        password: hashedPassword,
        age: 14,
        bio: "I am new here testing things out",
        _id: "621ff30d2a3e781873fcb663",
      });
      await user1.save();
    });

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user2 = new Usermodel({
        first_name: "hans",
        last_name: "peter",
        username: "hpeter",
        password: hashedPassword,
        age: 14,
        bio: "I am new here testing things out for second user",
        _id: "621ff30d2a3e781873fcb664",
      });

      await user2.save();
    });
  } catch (err) {
    console.log(err);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);
app.use("/chat", chat);

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

test("User can create a new chat", async () => {
  const payload = { userId: user1Id, otherUserId: user2Id };
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .post("/chat/newchat")
    .send(payload)
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.body.message).toEqual("New chat created");
      expect(typeof res.body.chatId).toEqual("string");
    });
});

test("Returns error if user not found", async () => {
  const payload = { userId: user1Id, otherUserId: "621ff30d2a3e781873fcb665" };

  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .post("/chat/newchat")
    .send(payload)
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.status).toEqual(404);
    });
});

test("Users have chat id added to document", async () => {
  const payload = { userId: user1Id, otherUserId: user2Id };

  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .post("/chat/newchat")
    .send(payload)
    .set("Content-Type", "application/json")
    .set(authorization)
    .then(async (res) => {
      const user1 = await Usermodel.findById("621ff30d2a3e781873fcb663");

      expect(`${user1.chats[1]}`).toEqual(`${res.body.chatId}`);
    });
});
