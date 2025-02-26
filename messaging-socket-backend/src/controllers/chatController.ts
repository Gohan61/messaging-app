import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { body, ValidationError, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { CustomError, SingleResponseType } from "../types/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

export const newMessage = [
  body("chatSid").trim().isLength({ min: 1 }),
  body("ownerUsername").trim().isLength({ min: 1 }),
  body("recipientUsername").trim().isLength({ min: 1 }),
  body("message").trim().isLength({ min: 1 }),

  asyncHandler(
    async (
      req: Request,
      res: Response<SingleResponseType<string | ValidationError[]>>,
      next: NextFunction
    ): Promise<void> => {
      const chatSid = req.body.chatSid;
      const ownerUsername = req.body.ownerUsername;
      const recipientUsername = req.body.recipientUsername;
      const message = req.body.message;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(500).json({ errors: errors.array() });
      }

      try {
        const chat = await prisma.chat.findUnique({
          where: {
            sid: chatSid,
          },
        });

        if (!chat) {
          next(new CustomError("Chat not found", 404));
        }

        const newMessage = await prisma.message.create({
          data: {
            chat: {
              connect: {
                sid: chatSid,
              },
            },
            owner: {
              connect: {
                username: ownerUsername,
              },
            },
            message,
            timestamp: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
          },
        });

        res.status(200).json({ message: "Message sent" });
      } catch (e) {
        throw new CustomError("Error sending message", 500);
      }
    }
  ),
];
