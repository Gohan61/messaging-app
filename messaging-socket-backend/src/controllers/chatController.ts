import asyncHandler from "express-async-handler";
import { io } from "../app";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { SingleResponseType } from "../types/types";

const prisma = new PrismaClient();

export const newChat = [
  body("recipientUsername").trim().isLength({ min: 1 }),
  body("ownerUsername").trim().isLength({ min: 1 }),

  asyncHandler(
    async (
      req: Request,
      res: Response<SingleResponseType<string>>,
      next: NextFunction
    ): Promise<void> => {
      const randomSid = uuidv4();
      const recipientUsername = req.body.recipientUsername;
      const ownerUsername = req.body.ownerUsername;

      io.sockets.on("connection", (socket) => {
        socket.on("createNewChat", () => {
          socket.join(randomSid);
        });
      });

      try {
        await prisma.chat.create({
          data: {
            sid: randomSid,
            date: format(new Date(), "dd-MM-yyyy"),
            owner: {
              connect: {
                username: ownerUsername,
              },
            },
            usersInChat: {
              create: [
                {
                  user: {
                    connect: {
                      username: recipientUsername,
                    },
                  },
                },
                {
                  user: {
                    connect: {
                      username: ownerUsername,
                    },
                  },
                },
              ],
            },
          },
        });
        res.status(200).json({ message: "New chat created" });
      } catch (e) {
        res.status(500).json({ errors: "Could not create new chat" });
      }
    }
  ),
];
