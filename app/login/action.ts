"use server";

import { db } from "../utils/db.server";
import { login, createUserSession, register } from "../utils/session.server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function validateUsername(username: string) {
  if (username.length < 3) {
    return "Usernames must be at least 3 characters long";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

export async function action(formData: FormData) {
  const form = formData;
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes",
  );
  console.log(redirectTo);
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return {
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    };
  }
  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
      fields,
      formError: null,
    };
  }
  switch (loginType) {
    case "login": {
      // login to get the user
      // if there's no user, return the fields and a formError
      // if there is a user, create their session and redirect to /jokes
      const user = await login({ username, password });
      console.log({ user });
      if (!user) {
        return {
          fieldErrors: null,
          fields,
          formError: "Username/Password combination is incorrect",
        };
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return {
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        };
      }
      const user = await register({ username, password });
      if (!user) {
        return {
          fieldErrors: null,
          fields,
          formError: "Something went wrong trying to create a new user.",
        };
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return {
        fieldErrors: null,
        fields,
        formError: "Login type invalid",
      };
    }
  }
}
/**
export async function createUserSession(userId: string, redirectTo: string) {
  const response = NextResponse.redirect(redirectTo, { status: 302 });
  response.cookies.set({
    name: "userId",
    value: userId,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  });
  return response;
}*/
