import { User } from "@prisma/client";
import { ValidationError } from "express-validator";

export type SingleResponseType<T> =
  | { message: T }
  | { errors: T }
  | { user: T };

type MessageAndValidationError = { message: string; errors: ValidationError[] };
type NoUserFound = { errors: string; user: User };
type AuthSuccessResponse = { token: string; username: string };

export type SigninResponse =
  | MessageAndValidationError
  | NoUserFound
  | AuthSuccessResponse;

export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface UserProfile {
  username: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
}

export type AllUsersType = { allUsers: UserProfile[] };
