"use client";
import Link from "next/link";
import { randomLoader } from "./loader";
import { useRandomJoke } from "./hooks";
import { css } from "../../styled-system/css";

export function Random({
  data,
}: { data: Awaited<ReturnType<typeof randomLoader>> }) {
  const randomJokeData = useRandomJoke();
  return (
    <>
      <p
        className={css({
          marginBlockStart: "16px",
        })}
      >
        Here&quot;s a random joke:
      </p>
      {randomJokeData ? (
        <>
          <p
            className={css({
              marginBlockStart: "16px",
              marginBlockEnd: "16px",
            })}
          >
            {randomJokeData.randomJoke.content}
          </p>
          <Link href={`jokes/${randomJokeData.randomJoke.id}`}>
            &quot;{randomJokeData.randomJoke.name}&quot; Permalink
          </Link>
        </>
      ) : (
        <>
          <p
            className={css({
              marginBlockStart: "16px",
              marginBlockEnd: "16px",
            })}
          >
            {data.randomJoke.content}
          </p>
          <Link href={`jokes/${data.randomJoke.id}`}>
            &quot;{data.randomJoke.name}&quot; Permalink
          </Link>
        </>
      )}
    </>
  );
}
