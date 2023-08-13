"use server";

import { logout } from "../utils/session.server";
import Link from "next/link";
import { ClientRoot } from "./clientroot";
import { loader } from "./loader";
import { css } from "../../styled-system/css";

export default async function JokesRoute({
  children,
}: { children: React.ReactNode }) {
  const data = await loader();
  console.log(data);
  return (
    <body>
      <div
        className={`${css({
          display: "flex",
          flexDirection: "column",
          minHeight: "inherit",
        })} jokes-layout`}
      >
        <header
          className={`${css({
            paddingTop: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--color-border)",
            display: "block",
          })} jokes-header`}
        >
          <div
            className={`${css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            })} container`}
          >
            <h1
              className={`${css({
                fontFamily: "var(--font-display)",
                fontSize: "3rem!",
                fontWeight: "bold",
              })} home-link`}
            >
              <Link
                href="/"
                title="Remix Jokes"
                aria-label="Remix Jokes"
                passHref
                legacyBehavior
              >
                <a
                  className={css({
                    color: "var(--color-foreground)!",
                    _hover: {
                      textDecoration: "none!",
                    },
                  })}
                >
                  <span
                    className={`${css({
                      sm: {
                        display: "none",
                      },
                    })} logo`}
                  >
                    🤪
                  </span>
                  <span
                    className={`${css({
                      display: "none",
                      sm: {
                        display: "block",
                      },
                    })} logo-medium`}
                  >
                    J🤪KES
                  </span>
                </a>
              </Link>
            </h1>
            {data.user ? (
              <div
                className={`${css({
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                })} user-info`}
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
                  className={css({
                    _hover: {
                      textDecorationStyle: "wavy!",
                      textDecorationThickness: "1px!",
                    },
                    fontWeight: "450",
                  })}
                >
                  Login
                </a>
              </Link>
            )}
          </div>
        </header>
        <main
          className={`${css({
            paddingTop: "2rem",
            paddingBottom: "2rem",
            flex: "1 1 100%",
            display: "block",
            sm: {
              paddingTop: "3rem",
              paddingBottom: "3rem",
            },
          })} jokes-main`}
        >
          <div
            className={`${css({
              display: "flex",
              gap: "1rem",
              flexDirection: "column",
              sm: {
                flexDirection: "row",
              },
            })} container`}
          >
            <ClientRoot data={data}>{children}</ClientRoot>
          </div>
        </main>
        <footer
          className={`${css({
            paddingTop: "2rem",
            paddingBottom: "1rem",
            borderTop: "1px solid var(--color-border)",
          })} jokes-footer`}
        >
          <div className="container">
            <Link href="api/rss">RSS</Link>
          </div>
        </footer>
      </div>
    </body>
  );
}
