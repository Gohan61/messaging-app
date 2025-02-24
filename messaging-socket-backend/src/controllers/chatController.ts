import asyncHandler from "express-async-handler";
import { io } from "../app";
import { v4 as uuidv4 } from "uuid";
import { body, ValidationError, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { CustomError, SingleResponseType } from "../types/types";

const prisma = new PrismaClient();

export const newChat = [
  body("recipientUsername").trim().isLength({ min: 1 }),
  body("ownerUsername").trim().isLength({ min: 1 }),

  asyncHandler(
    async (
      req: Request,
      res: Response<SingleResponseType<string | ValidationError[]>>,
      next: NextFunction
    ): Promise<void> => {
      const randomSid = uuidv4();
      const recipientUsername = req.body.recipientUsername;
      const ownerUsername = req.body.ownerUsername;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(500).json({ errors: errors.array() });
      }

      try {
        io.sockets.on("connection", (socket) => {
          socket.on("createNewChat", () => {
            socket.join(randomSid);
          });
        });

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
        throw new CustomError("Error creating chat", 500);
      }
    }
  ),
];
