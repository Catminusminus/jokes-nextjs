import { db } from "../../utils/db.server";
import { getUserId } from "../../utils/session.server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JokeDisplay } from "../components/joke";

const loader = async (params: { jokeId: string }) => {
  const userId = await getUserId();
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Error("What a joke! Not found.");
  }
  return { isOwner: userId === joke.jokesterId, joke };
};

export async function generateMetadata({
  params,
}: { params: { jokeId: string } }) {
  const data = await loader(params);
  const { description, title } = data
    ? {
        description: `Enjoy the "${data.joke.name}" joke and much more`,
        title: `"${data.joke.name}" joke`,
      }
    : { description: "No joke found", title: "No joke" };
  return {
    title,
    description,
    twitter: {
      description,
    },
  };
}

/*
export default async function JokeRoute({
  params,
}: { params: { jokeId: string } }) {
  const data = await loader(params);
  return (
    <div>
      <p>Here&quot;s your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link href={`/jokes/${params.jokeId}`}>
        &quot;{data.joke.name}&quot; Permalink
      </Link>
      <form method="post" action={action}>
        <input type="hidden" name="jokeId" value={params.jokeId} />
        <button className="button" name="intent" type="submit" value="delete">
          Delete
        </button>
      </form>
    </div>
  );
}
*/

export default async function JokeRoute({
  params,
}: { params: { jokeId: string } }) {
  const data = await loader(params);
  return (
    <JokeDisplay
      isOwner={data.isOwner}
      jokeId={params.jokeId}
      joke={data.joke}
    />
  );
}
