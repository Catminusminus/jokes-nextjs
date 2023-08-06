"use server";

import { redirect } from "next/navigation";
import { db } from "../../utils/db.server";
import { requireUserId } from "../../utils/session.server";

export async function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "That joke is too short";
  }
}

export async function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke's name is too short";
  }
}

export async function action(formData: FormData) {
  const form = formData;
  const url = form.get("url");
  const content = form.get("content");
  const name = form.get("name");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof url !== "string" ||
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return {
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    };
  }
  const userId = await requireUserId(url);
  const fieldErrors = {
    content: await validateJokeContent(content),
    name: await validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
      fields,
      formError: null,
    };
  }
  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  redirect(`/jokes/${joke.id}`);
}
