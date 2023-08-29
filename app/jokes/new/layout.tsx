import { getUserId } from "../../utils/session.server";
import Link from "next/link";

const loader = async () => {
  const userId = await getUserId();
  if (!userId) {
    return new Error("Unauthorized");
  }
};

export default async function NewJokeRoute({
  children,
}: { children: React.ReactNode }) {
  const err = await loader();
  if (err) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link href="/login">Login</Link>
      </div>
    );
  }
  return <>{children}</>;
}
