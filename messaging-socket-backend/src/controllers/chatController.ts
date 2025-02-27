import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { body, ValidationError, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { CustomError, SingleResponseType } from "../types/types";
import { Chat } from "@prisma/client";

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

export const getAllChats = async (
  req: Request,
  res: Response<SingleResponseType<Chat[] | []>>,
  next: NextFunction
): Promise<void> => {
  const userName: string = req.params.username;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        usersInChat: {
          some: {
            userUsername: userName,
          },
        },
      },
      include: {
        usersInChat: true,
      },
    });

    if (chats.length === 0) {
      return next(new CustomError("No chats found", 404));
    }

    res.status(200).json({ data: chats });
  } catch (e) {
    throw new CustomError("Error fetching chats", 500);
  }
};

export const getSingleChat = async (
  req: Request,
  res: Response<SingleResponseType<Chat | null>>,
  next: NextFunction
): Promise<void> => {
  const chatSid: string = req.params.sid;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        sid: chatSid,
      },
      include: {
        usersInChat: true,
      },
    });

    if (!chat) {
      return next(new CustomError("Chat not found", 404));
    }

    res.status(200).json({ data: chat });
  } catch (e) {
    throw new CustomError("Error fetching chat", 500);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response<SingleResponseType<string>>,
  next: NextFunction
): Promise<void> => {
  const chatSid: string = req.params.sid;
  const userName = req.params.username;

  const chat = await prisma.chat.findUnique({
    where: {
      sid: chatSid,
    },
  });

  if (!chat) {
    return next(new CustomError("Chat not found", 404));
  }

  if (chat.ownerUsername !== userName) {
    return next(new CustomError("You are not the owner of this chat", 401));
  }

  try {
    await prisma.message.deleteMany({
      where: {
        chatId: chatSid,
      },
    });

    await prisma.usersInChat.deleteMany({
      where: {
        chatSid,
      },
    });

    await prisma.chat.delete({
      where: {
        sid: chatSid,
      },
    });

    res.status(200).json({ message: "Chat deleted" });
  } catch (e) {
    throw new CustomError("Error deleting chat", 500);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response<SingleResponseType<string>>,
  next: NextFunction
): Promise<void> => {
  const userName = req.params.username;
  const messageId = req.params.messageId;

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!message) {
    return next(new CustomError("Message not found", 404));
  }

  if (message.ownerUsername !== userName) {
    return next(
      new CustomError("You cannot delete someone else's message", 401)
    );
  }

  try {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    res.status(200).json({ message: "Message deleted" });
  } catch (e) {
    throw new CustomError("Error deleting message", 500);
  }
};
