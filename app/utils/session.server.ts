"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { parse } from "cookie";

import { db } from "./db.server";
import { createCookieSessionStorage } from "./cookie.server";
import { redirectWithCookie } from "./redirect.server";
import { headers } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { RedirectType } from "./redirect.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function register({ password, username }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { passwordHash, username },
  });
  return { id: user.id, username };
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  const cookies = parse(await storage.commitSession(session));
  /**
  const res = NextResponse.redirect(redirectTo);
  const cookies = parse(await storage.commitSession(session));
  for (const key in cookies) {
    res.cookies.set(key, cookies[key]);
  }
  return res;
  */
  console.log(cookies);
  console.log("login");
  //revalidatePath(redirectTo);
  redirectWithCookie(redirectTo, cookies);
}

function getUserSession() {
  const requestHeaders = headers();
  console.log("get");
  console.log(requestHeaders.get("Cookie"));
  return storage.getSession(requestHeaders.get("Cookie"));
}

export async function getUserId() {
  const session = await getUserSession();
  const userId = session.get("userId");
  console.log(userId);

  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(url: string, redirectTo: string = url) {
  console.log(url);
  const session = await getUserSession();
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser() {
  const userId = await getUserId();
  console.log(userId);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });

  if (!user) {
    throw logout();
  }

  return user;
}

export async function logout() {
  const session = await getUserSession();
  console.log("hi");
  const cookies = parse(await storage.destroySession(session));
  console.log(cookies);
  //redirect("/");
  //revalidatePath("/");
  redirectWithCookie("/login", cookies, RedirectType.replace);
}
