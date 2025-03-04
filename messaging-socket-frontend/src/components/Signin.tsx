import { useState } from "react";
import FormComponent from "./styled-components/Form";
import HeaderH1 from "./styled-components/HeaderH1";
import Input from "./styled-components/Input";
import Label from "./styled-components/Label";
import { signinFormState, signinValidationErrors } from "../types/types";
import SubmitButton from "./styled-components/SubmitButton";
import { singleValidationError } from "../types/types";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [form, setForm] = useState<signinFormState>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
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
    let respStatus: number;

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
        respStatus = res.status;
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
        if (respStatus == 200) {
          setError(null);
          setValidationError({
            username: null,
            password: null,
          });
          localStorage.setItem("token", res.token);
          localStorage.setItem("username", res.username);
          navigate("/");
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
          <p className="text-red-700" data-testId="usernameError">
            {validationError.username}
          </p>
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
          <p className="text-red-700" data-testId="passwordError">
            {validationError.password}
          </p>
        ) : (
          ""
        )}
        <br />
        <SubmitButton submitFunction={signinForm} body={form}></SubmitButton>
      </FormComponent>
      {error ? (
        <p className="text-red-600 pt-4 font-bold" data-testId="genericError">
          {error}
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
