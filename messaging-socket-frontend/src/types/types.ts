import { Dispatch, SetStateAction } from "react";

export interface signupFormState {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  bio: string;
}

export type SubmitFunctionType = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  body: signupFormState
) => void;

export interface singleValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export type validationErrorsType = singleValidationError[];

export interface signupValidationErrors {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  password: string | null;
  bio: string | null;
}

export interface inputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  form: signupFormState | signinFormState;
  maxLength?: number;
  stateSetter:
    | Dispatch<SetStateAction<signupFormState>>
    | Dispatch<SetStateAction<signinFormState>>;
  setValidationState:
    | Dispatch<SetStateAction<signupValidationErrors>>
    | Dispatch<SetStateAction<signinValidationErrors>>;
  validationState: signupValidationErrors | signinValidationErrors;
}

export interface textAreaProps {
  name: string;
  id: string;
  value: string;
  form: signupFormState;
  maxLength?: number;
  stateSetter: Dispatch<SetStateAction<signupFormState>>;
  setValidationState: Dispatch<SetStateAction<signupValidationErrors>>;
  validationState: signupValidationErrors;
}

export interface signinFormState {
  username: string;
  password: string;
}

export interface signinValidationErrors {
  username: string | null;
  password: string | null;
}
