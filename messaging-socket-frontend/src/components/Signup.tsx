import { useState } from "react";
import FormComponent from "./styled-components/Form";
import SubmitButton from "./styled-components/SubmitButton";
import Label from "./styled-components/Label";
import Input from "./styled-components/Input";
import {
  signupFormState,
  signupValidationErrors,
  singleValidationError,
} from "../types/types";
import HeaderH1 from "./styled-components/HeaderH1";
import TextArea from "./styled-components/TextArea";

export default function Signup() {
  const [form, setForm] = useState<signupFormState>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] =
    useState<signupValidationErrors>({
      firstName: null,
      lastName: null,
      username: null,
      password: null,
      bio: null,
    });

  function signupForm(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    form: signupFormState
  ) {
    e.preventDefault();

    fetch(`http://localhost:3000/signup`, {
      mode: "cors",
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        password: form.password,
        bio: form.bio,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.errors) {
          const copyValidationErrors = { ...validationError };

          res.errors.forEach((item: singleValidationError) => {
            switch (item.path) {
              case "username":
                copyValidationErrors.username = item.msg;
                break;
              case "password":
                copyValidationErrors.password = item.msg;
                break;
              case "first_name":
                copyValidationErrors.firstName = item.msg;
                break;
              case "last_name":
                copyValidationErrors.lastName = item.msg;
                break;
              case "bio":
                copyValidationErrors.bio = item.msg;
                break;
            }
          });

          setValidationError(copyValidationErrors);
        }
        if (res.errorMessage) {
          setError(res.errorMessage);
        }
        if (res.message) {
          setError(null);
          setValidationError({
            firstName: null,
            lastName: null,
            username: null,
            password: null,
            bio: null,
          });
          console.log(res.message);
        }
      });
  }

  return (
    <div className="flex flex-col items-center">
      <HeaderH1 text={"Sign up"}></HeaderH1>
      <FormComponent>
        <Label htmlForValue={"firstName"} labelText={"First name: "}></Label>
        <Input
          props={{
            type: "text",
            id: "firstName",
            name: "firstName",
            value: form.firstName,
            form: form,
            maxLength: 30,
            stateSetter: setForm,
            setValidationState: setValidationError,
            validationState: validationError,
          }}
        ></Input>
        {validationError.firstName ? (
          <p className="text-red-700">{validationError.firstName}</p>
        ) : (
          ""
        )}
        <br />
        <Label htmlForValue={"lastName"} labelText={"Last name: "}></Label>
        <Input
          props={{
            type: "text",
            id: "lastName",
            name: "lastName",
            value: form.lastName,
            form: form,
            maxLength: 30,
            stateSetter: setForm,
            setValidationState: setValidationError,
            validationState: validationError,
          }}
        ></Input>
        {validationError.lastName ? (
          <p className="text-red-700">{validationError.lastName}</p>
        ) : (
          ""
        )}
        <br />
        <Label htmlForValue={"username"} labelText={"*Username: "}></Label>
        <Input
          props={{
            type: "text",
            id: "username",
            name: "username",
            value: form.username,
            form: form,
            maxLength: 20,
            stateSetter: setForm,
            setValidationState: setValidationError,
            validationState: validationError,
          }}
        ></Input>
        {validationError.username ? (
          <p className="text-red-700">{validationError.username}</p>
        ) : (
          ""
        )}
        <br />
        <Label htmlForValue={"password"} labelText={"*Password: "}></Label>
        <Input
          props={{
            type: "password",
            id: "password",
            name: "password",
            value: form.password,
            form: form,
            maxLength: 50,
            stateSetter: setForm,
            setValidationState: setValidationError,
            validationState: validationError,
          }}
        ></Input>
        {validationError.password ? (
          <p className="text-red-700">{validationError.password}</p>
        ) : (
          ""
        )}
        <br />
        <Label htmlForValue={"bio"} labelText={"Bio: "}></Label>
        <TextArea
          props={{
            id: "bio",
            name: "bio",
            value: form.bio,
            form: form,
            maxLength: 255,
            stateSetter: setForm,
            setValidationState: setValidationError,
            validationState: validationError,
          }}
        ></TextArea>
        {validationError.bio ? (
          <p className="text-red-700">{validationError.bio}</p>
        ) : (
          ""
        )}
        <br />
        <SubmitButton submitFunction={signupForm} body={form}></SubmitButton>
      </FormComponent>

      {error ? <p className="text-red-600 pt-4 font-bold">{error}</p> : ""}
    </div>
  );
}
