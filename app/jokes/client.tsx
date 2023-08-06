"use client";

import Link from "next/link";
import { useTransition } from "react";
import { randomLoader, loader } from "./loader";
import { useSetRandomJoke } from "./hooks";

export function RandomLink({
  data,
}: { data: Awaited<ReturnType<typeof loader>> }) {
  const setRandomJoke = useSetRandomJoke();
  const [_, startTransaction] = useTransition();
  const handleSubmit = () => {
    startTransaction(async () => {
      const res = await randomLoader();
      console.log(res);
      setRandomJoke((t) => res);
    });
  };
  return (
    <>
      <Link onClick={handleSubmit} href="/jokes">
        Get a random joke
      </Link>
      <p>Here are a few more jokes to check out:</p>
      <ul>
        {data.jokeListItems.map(({ id, name }) => (
          <li key={id}>
            <Link href={`/jokes/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
