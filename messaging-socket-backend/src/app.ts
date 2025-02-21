import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import * as routes from "../src/routes/index";
import "./config/passport";
import passport from "passport";
import { CustomError } from "./types/types";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.emit("connect", { message: "a new client connected" });
});

app.use("/", routes.signinup);
app.use("/user", passport.authenticate("jwt", { session: false }), routes.user);
app.use("/chat", passport.authenticate("jwt", { session: false }), routes.chat);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const errorResponse = {
    message: err.message || "Internal Server Error",
    status,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  res.status(status).send(errorResponse);
});

const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
export { io };
