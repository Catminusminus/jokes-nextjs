import type { Joke } from "@prisma/client";
import Link from "next/link";
import { action } from "./action";

export function JokeDisplay({
  canDelete = true,
  isOwner,
  joke,
  jokeId,
}: {
  canDelete?: boolean;
  isOwner: boolean;
  joke: Pick<Joke, "content" | "name">;
  jokeId: string;
}) {
  return (
    <div>
      <p>Here&apos;s your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link href={`/jokes/${jokeId}`}>&quot;{joke.name}&quot; Permalink</Link>
      {isOwner ? (
        <form action={action}>
          <input type="hidden" name="jokeId" value={jokeId} />
          <button
            className="button"
            disabled={!canDelete}
            name="intent"
            type="submit"
            value="delete"
          >
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}
