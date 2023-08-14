import { randomLoader } from "./loader";
import { Random } from "./random";

export default async function JokesIndexRoute() {
  const data = await randomLoader();
  return (
    <div>
      <Random data={data} />
    </div>
  );
}
