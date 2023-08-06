import Link from "next/link";
import { randomLoader } from "./loader";
import { Random } from "./random";

export default async function JokesIndexRoute() {
  const data = await randomLoader();
  return (
    <div>
      <Random data={data} />
      <Link href="/jokes">hi</Link>
    </div>
  );
}
