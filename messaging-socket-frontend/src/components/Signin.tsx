import { useState } from "react";
import FormComponent from "./styled-components/Form";
import HeaderH1 from "./styled-components/HeaderH1";
import Input from "./styled-components/Input";
import Label from "./styled-components/Label";
import { signinFormState, signinValidationErrors } from "../types/types";
import SubmitButton from "./styled-components/SubmitButton";
import { singleValidationError } from "../types/types";

export default function Signin() {
  const [form, setForm] = useState<signinFormState>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] =
    useState<signinValidationErrors>({
      username: null,
      password: null,
    });

  function signinForm(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    form: signinFormState
  ) {
    e.preventDefault();

    fetch(`http://localhost:3000/signin`, {
      mode: "cors",
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
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
            username: null,
            password: null,
          });
          console.log(res.message);
        }
      });
  }

  return (
    <div className="flex flex-col items-center">
      <HeaderH1 text={"Sign in"}></HeaderH1>
      <FormComponent>
        <Label htmlForValue="username" labelText="Username: "></Label>
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
        <Label htmlForValue="password" labelText="Password: "></Label>
        <Input
          props={{
            type: "text",
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
        <SubmitButton submitFunction={signinForm} body={form}></SubmitButton>
      </FormComponent>
      {error ? <p className="text-red-600 pt-4 font-bold">{error}</p> : ""}
    </div>
  );
}
