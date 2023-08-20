"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { action } from "./action";
import { css } from "excss";

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
      className={`${css`
        min-height: inherit;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `} container`}
    >
      <div
        className={`${css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          background-color: hsl(0, 0%, 100%);
          border-radius: 5px;
          box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.5);
          width: 400px;
          max-width: 100%;
          @media print, (min-width: 640px) {
            padding: 2rem;
            border-radius: 8px;
          }
        `} content`}
        data-light=""
      >
        <h1
          className={css`
            margin-top: 0;
            font-weight: bold;
          `}
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
            className={css`
              display: flex;
              justify-content: center;
            `}
          >
            <legend className="sr-only">Login or Register?</legend>
            <label className={css`margin-right: 2rem;`}>
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
          className={css`
            margin-top: 1rem;
            padding: 0;
            list-style: none;
            display: flex;
            gap: 1.5rem;
            align-items: center;
          `}
        >
          <li>
            <Link href="/" passHref legacyBehavior>
              <a
                className={css`&:hover {
                      text-decoration-style: wavy;
                      text-decoration-thickness: 1px;
                    }`}
              >
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/jokes" passHref legacyBehavior>
              <a
                className={css`&:hover {
                      text-decoration-style: wavy;
                      text-decoration-thickness: 1px;
                    }`}
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
