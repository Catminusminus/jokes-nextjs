"use client";

import Link from "next/link";
import { useTransition } from "react";
import { randomLoader, loader } from "./loader";
import { useSetRandomJoke } from "./hooks";
import { css } from "excss";

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
      <p
        className={css`
          margin-block-start: 16px;
          margin-block-end: 16px;
        `}
      >
        Here are a few more jokes to check out:
      </p>
      <ul
        className={css`
          list-style-type: disc;
          padding-inline-start: 40px;
        `}
      >
        {data.jokeListItems.map(({ id, name }) => (
          <li key={id}>
            <Link href={`/jokes/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
