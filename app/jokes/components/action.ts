"use server";

import { db } from "../../utils/db.server";
import { getUserId } from "../../utils/session.server";
import { redirect } from "next/navigation";

export const action = async (formData: FormData) => {
  if (formData.get("intent") !== "delete") {
    throw new Error(`The intent ${formData.get("intent")} is not supported`);
  }
  const userId = await getUserId();
  const jokeId = formData.get("jokeId");
  if (typeof jokeId !== "string") {
    throw new Error("What a joke! Not found.");
  }
  const joke = await db.joke.findUnique({
    where: { id: jokeId },
  });
  if (!joke) {
    throw new Error("Can't delete what does not exist");
  }
  if (joke.jokesterId !== userId) {
    throw new Error("Pssh, nice try. That's not your joke");
  }
  await db.joke.delete({ where: { id: jokeId } });
  return redirect("/jokes");
};
