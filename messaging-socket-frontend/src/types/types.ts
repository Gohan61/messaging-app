import { Dispatch, SetStateAction } from "react";

export interface formState {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  bio: string;
}

export type SubmitFunctionType = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  body: formState
) => void;

export interface singleValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export type validationErrorsType = singleValidationError[];

export interface validationErrors {
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
  form: formState;
  maxLength?: number;
  stateSetter: Dispatch<SetStateAction<formState>>;
  setValidationState: Dispatch<SetStateAction<validationErrors>>;
  validationState: validationErrors;
}

export interface textAreaProps {
  name: string;
  id: string;
  value: string;
  form: formState;
  maxLength?: number;
  stateSetter: Dispatch<SetStateAction<formState>>;
  setValidationState: Dispatch<SetStateAction<validationErrors>>;
  validationState: validationErrors;
}
