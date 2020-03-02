import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";

import styles from "./Form.module.scss";

const Form = props => {
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          ref={register({
            required: "Nødvendig",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "invalid email address"
            }
          })}
        />
        <ErrorMessage errors={errors} name={"email"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          ref={register({
            validate: value => value !== "admin" || "Nice try!"
          })}
        />
        <ErrorMessage errors={errors} name={"username"}>
          {({ message }) => <span>{message}</span>}
        </ErrorMessage>
      </div>
      <button type="submit">Submit</button>
      <br />
      {props.children}
    </form>
  );
};

export default Form;
