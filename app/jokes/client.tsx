"use client";

import Link from "next/link";
import { useTransition } from "react";
import { randomLoader, loader } from "./loader";
import { useSetRandomJoke } from "./hooks";
import { css } from "../../styled-system/css";

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
        className={css({
          marginBlockStart: "16px",
          marginBlockEnd: "16px",
        })}
      >
        Here are a few more jokes to check out:
      </p>
      <ul
        className={css({
          listStyleType: "disc",
          paddingInlineStart: "40px",
        })}
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
