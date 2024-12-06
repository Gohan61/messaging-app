import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserProfile = asyncHandler(
  async (req, res, next): Promise<any> => {
    const username = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        first_name: true,
        last_name: true,
        bio: true,
      },
    });

    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    } else {
      return res.status(200).json({ user: user });
    }
  }
);

export const getUserList = asyncHandler(
  async (req, res, next): Promise<any> => {
    const allUsers = await prisma.user.findMany({
      select: {
        first_name: true,
        last_name: true,
        username: true,
        bio: true,
      },
    });

    if (allUsers.length === 0) {
      return res.status(404).json({ errors: "No users found" });
    } else {
      return res.status(200).json({ allUsers: allUsers });
    }
  }
);
