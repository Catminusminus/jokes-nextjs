"use server";
import { db } from "../utils/db.server";
import { getUser } from "../utils/session.server";

export const randomLoader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  return { randomJoke };
};

export const loader = async () => ({
  jokeListItems: await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  }),
  user: await getUser(),
});
