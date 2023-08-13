"use client";

import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { action } from "./action";
import { css } from "../../styled-system/css";

export default function Login() {
  const searchParams = useSearchParams();
  const [actionData, setActionData] = useState<Awaited<
    ReturnType<typeof action>
  > | null>(null);
  const [_, startTransaction] = useTransition();
  const handleSubmit = (data: FormData) => {
    startTransaction(async () => {
      const res = await action(data);
      setActionData(res);
    });
  };
  return (
    <div
      className={`${css({
        minHeight: "inherit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      })} container`}
    >
      <div
        className={`${css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "hsl(0, 0%, 100%)",
          borderRadius: "5px",
          boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.5)",
          width: "400px",
          maxWidth: "100%",
          sm: {
            padding: "2rem",
            borderRadius: "8px",
          },
        })} content`}
        data-light=""
      >
        <h1
          className={css({
            marginTop: "0",
            fontWeight: "bold",
          })}
        >
          Login
        </h1>
        <form action={handleSubmit}>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset
            className={css({
              display: "flex",
              justifyContent: "center",
            })}
          >
            <legend className="sr-only">Login or Register?</legend>
            <label className={css({ marginRight: "2rem!" })}>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul
          className={css({
            marginTop: "1rem",
            padding: "0",
            listStyle: "none",
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          })}
        >
          <li>
            <Link href="/" passHref legacyBehavior>
              <a
                className={css({
                  _hover: {
                    textDecorationStyle: "wavy",
                    textDecorationThickness: "1px",
                  },
                })}
              >
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/jokes" passHref legacyBehavior>
              <a
                className={css({
                  _hover: {
                    textDecorationStyle: "wavy",
                    textDecorationThickness: "1px",
                  },
                })}
              >
                Jokes
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
