import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import * as routes from "../src/routes/index";
import "./config/passport";
import passport from "passport";
import { CustomError } from "./types/types";
import cors from "cors";
import socketIo from "./controllers/socket_io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

socketIo(io);

app.use("/", routes.signinup);
app.use("/user", passport.authenticate("jwt", { session: false }), routes.user);
app.use("/chat", passport.authenticate("jwt", { session: false }), routes.chat);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const errorResponse = {
    errorMessage: err.message || "Internal Server Error",
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
