"use server";

import "../jokes.css";
import { logout } from "../utils/session.server";
import Link from "next/link";
import { ClientRoot } from "./clientroot";
import { loader } from "./loader";

export default async function JokesRoute({
  children,
}: { children: React.ReactNode }) {
  const data = await loader();
  console.log(data);
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link href="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action={logout}>
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <ClientRoot data={data}>{children}</ClientRoot>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link href="api/rss">RSS</Link>
        </div>
      </footer>
    </div>
  );
}
