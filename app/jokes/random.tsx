"use client";
import Link from "next/link";
import { randomLoader } from "./loader";
import { useRandomJoke } from "./hooks";

export function Random({
  data,
}: { data: Awaited<ReturnType<typeof randomLoader>> }) {
  const randomJokeData = useRandomJoke();
  return (
    <>
      {randomJokeData ? (
        <>
          <p>{randomJokeData.randomJoke.content}</p>
          <Link href={`jokes/${randomJokeData.randomJoke.id}`}>
            &quot;{randomJokeData.randomJoke.name}&quot; Permalink
          </Link>
        </>
      ) : (
        <>
          <p>{data.randomJoke.content}</p>
          <Link href={`jokes/${data.randomJoke.id}`}>
            &quot;{data.randomJoke.name}&quot; Permalink
          </Link>
        </>
      )}
    </>
  );
}
