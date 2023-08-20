"use server";

import { logout } from "../utils/session.server";
import Link from "next/link";
import { ClientRoot } from "./clientroot";
import { loader } from "./loader";
import { css } from "excss";

export default async function JokesRoute({
  children,
}: { children: React.ReactNode }) {
  const data = await loader();
  console.log(data);
  return (
    <body>
      <div
        className={`${css`
          display: flex;
          flex-direction: column;
          min-height: inherit;
        `} jokes-layout`}
      >
        <header
          className={`${css`
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--color-border);
            display: block;
          `} jokes-header`}
        >
          <div
            className={`${css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `} container`}
          >
            <h1
              className={`${css`
                font-family: var(--font-display);
                font-size: 3rem;
                font-weight: bold;
              `} home-link`}
            >
              <Link
                href="/"
                title="Remix Jokes"
                aria-label="Remix Jokes"
                passHref
                legacyBehavior
              >
                <a
                  className={css`
                    color: var(--color-foreground);
                    &:hover {
                      text-decoration: none;
                    }
                  `}
                >
                  <span
                    className={`${css`
                      @media print, (min-width: 640px) {
                        display: none;
                      }`} logo`}
                  >
                    🤪
                  </span>
                  <span
                    className={`${css`
                      display: none;
                      @media print, (min-width: 640px) {
                          display: block;
                      }`} logo-medium`}
                  >
                    J🤪KES
                  </span>
                </a>
              </Link>
            </h1>
            {data.user ? (
              <div
                className={`${css`
                  display: flex;
                  gap: 1rem;
                  align-items: center;
                  white-space: nowrap;`} user-info`}
              >
                <span>{`Hi ${data.user.username}`}</span>
                <form action={logout}>
                  <button type="submit" className="button">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" passHref legacyBehavior>
                <a
                  className={css`
                    &:hover {
                      text-decoration-style: wavy;
                      text-decoration-thickness: 1px;
                  }
                  `}
                >
                  Login
                </a>
              </Link>
            )}
          </div>
        </header>
        <main
          className={`${css`
            padding-top: 2rem;
            padding-bottom: 2rem;
            flex: 1 1 100%;
            @media print, (min-width: 640px) {            
              padding-top: 3rem;
              padding-bottom: 3rem;
            }
          `} jokes-main`}
        >
          <div
            className={`${css`
              display: flex;
              gap: 1rem;
              @media (max-width: 639px) {
                flex-direction: column;
              }
            `} container`}
          >
            <ClientRoot data={data}>{children}</ClientRoot>
          </div>
        </main>
        <footer
          className={`${css`
            padding-top: 2rem;
            padding-bottom: 1rem;
            border-top: 1px solid var(--color-border);
          `} jokes-footer`}
        >
          <div className="container">
            <Link href="api/rss">RSS</Link>
          </div>
        </footer>
      </div>
    </body>
  );
}
