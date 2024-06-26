const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const chat = require("../routes/chats");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const Chatmodel = require("../models/chats");
const bcrypt = require("bcryptjs");
let token;
const user1Id = "621ff30d2a3e781873fcb663";

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
        chats: ["621ff30d2a3e781873fcb669"],
      });
      await user1.save();
    });

    const user2 = new Usermodel({
      first_name: "hans",
      last_name: "peter",
      username: "peter",
      password: "testing",
      age: 24,
      bio: "I am new here testing things out",
      _id: "621ff30d2a3e781873fcb664",
      chats: ["621ff30d2a3e781873fcb669"],
    });

    await user2.save();

    const chat = new Chatmodel({
      users: ["621ff30d2a3e781873fcb663", "621ff30d2a3e781873fcb664"],
      messages: [],
      otherUser: "peter",
      date: "20-06-2024",
      _id: "621ff30d2a3e781873fcb669",
    });

    await chat.save();
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

test("Returns chats object", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get("/chat/chatList/621ff30d2a3e781873fcb663")
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.body.chats[0]._id).toEqual("621ff30d2a3e781873fcb669");
    });
});
