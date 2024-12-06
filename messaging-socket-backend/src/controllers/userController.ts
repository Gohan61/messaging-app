import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

export const updateUser = [
  body("first_name")
    .trim()
    .optional()
    .isLength({ max: 30 })
    .withMessage("First name can be maximum 30 characters long"),
  body("last_name")
    .trim()
    .optional()
    .isLength({ max: 30 })
    .withMessage("Last name can be maximum 30 characters long"),
  body("oldUsername").trim().isLength({ min: 1 }).isLength({ max: 20 }),
  body("newUsername")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Username can be maximum 20 characters long")
    .not()
    .isIn(["list"])
    .withMessage("'list' cannot be used as username "),
  body("oldPassword")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Password can be maximum 50 characters long"),
  body("newPassword")
    .trim()
    .optional()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Password can be maximum 50 characters long"),
  body("bio")
    .trim()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Bio can be maximum 255 characters long"),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const body: {
      first_name: string | undefined;
      last_name: string | undefined;
      oldUsername: string;
      newUsername: string;
      oldPassword: string;
      newPassword: string | undefined;
      bio: string | undefined;
    } = req.body;

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const findUser = await prisma.user.findUnique({
      where: {
        username: body.oldUsername,
      },
    });
    if (!findUser) {
      return res.status(500).json({ errors: "Could not find user" });
    }
    const match = await bcrypt.compare(body.oldPassword, findUser.password);
    if (!match) {
      return res.status(500).json({ errors: "Incorrect password" });
    }

    try {
      let hashedPassword: string = findUser.password;
      if (body.newPassword) {
        hashedPassword = bcrypt.hashSync(body.newPassword, 10);
      }
      let username: string;

      if (body.oldUsername === body.newUsername) {
        username = body.oldUsername;
      } else {
        username = body.newUsername;
      }

      const user = await prisma.user.update({
        where: {
          username: findUser.username,
        },
        data: {
          first_name: body.first_name,
          last_name: body.last_name,
          username: username,
          password: hashedPassword,
          bio: body.bio,
        },
      });

      return res.status(200).json({ message: "User updated" });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(500).json({ errors: "Username already exists" });
      }

      return next(err);
    }
  }),
];
