import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export const signup = [
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
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty")
    .isLength({ max: 20 })
    .withMessage("Username can be maximum 20 characters long")
    .not()
    .isIn(["list"])
    .withMessage("'list' cannot be used as username "),
  body("password")
    .trim()
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
      username: string;
      password: string;
      bio: string | undefined;
    } = req.body;

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = bcrypt.hashSync(body.password, 10);

      const user = await prisma.user.create({
        data: {
          first_name: body.first_name,
          last_name: body.last_name,
          username: body.username,
          password: hashedPassword,
          bio: body.bio,
        },
      });

      return res.status(200).json({ message: "User saved" });
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

export const signin = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty"),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(404)
        .json({ message: "Could not login user", errors: errors.array() });
    }

    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: User, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.status(404).json({ errors: "User not found", user });
        } else {
          req.logIn(user, { session: false }, (err) => {
            if (err) {
              next(err);
            }

            if (!process.env.SECRET) {
              throw new Error("Environment variable SECRET is not set");
            }

            jwt.sign(
              { user: user },
              process.env.SECRET,
              { expiresIn: "10d" },
              (err, token) => {
                if (err) {
                  return next(err);
                }

                return res.status(200).json({
                  token: token,
                  username: user.username,
                });
              }
            );
          });
        }
      }
    )(req, res, next);
  }),
];
