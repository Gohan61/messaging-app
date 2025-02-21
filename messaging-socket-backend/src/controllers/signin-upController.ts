import asyncHandler from "express-async-handler";
import { body, ValidationError, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  SigninResponse,
  SingleResponseType,
} from "../types/types";

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

  asyncHandler(
    async (
      req: Request,
      res: Response<SingleResponseType<string | ValidationError[]>>,
      next: NextFunction
    ): Promise<void> => {
      const errors = validationResult(req);
      const body: {
        first_name: string | undefined;
        last_name: string | undefined;
        username: string;
        password: string;
        bio: string | undefined;
      } = req.body;

      if (!errors.isEmpty()) {
        res.status(500).json({ errors: errors.array() });
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

        res.status(200).json({ message: "User saved" });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new CustomError("Username already exists", 500);
        }

        return next(err);
      }
    }
  ),
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

  asyncHandler(
    async (
      req: Request,
      res: Response<SigninResponse | SingleResponseType<string>>,
      next: NextFunction
    ): Promise<void> => {
      const errors = validationResult(req);
      let user: User | undefined;
      let token;

      if (!errors.isEmpty()) {
        res
          .status(404)
          .json({ message: "Could not login user", errors: errors.array() });
      }

      try {
        user = await new Promise<User>((resolve, reject) => {
          passport.authenticate(
            "local",
            { session: false },
            (err: unknown, user: User, info: any) => {
              if (err) {
                return reject(err);
              }
              if (!user) {
                throw new CustomError("User not found", 404);
              }

              req.logIn(user, { session: false }, (err) => {
                if (err) {
                  return reject(err);
                }
                resolve(user);
              });
            }
          )(req, res, next);
        });
      } catch (err) {
        next(err);
      }

      try {
        if (!user) {
          throw new CustomError("Something went wrong", 500);
        }

        jwt.sign(
          { user: user },
          process.env.SECRET as string,
          { expiresIn: "10d" },
          (err, token) => {
            if (err) {
              return next(err);
            }

            if (!token) {
              return next(new CustomError("JWT could not be generated", 500));
            }

            return res.status(200).json({
              token: token,
              username: user.username,
            });
          }
        );
      } catch (err) {
        next(err);
      }
    }
  ),
];
