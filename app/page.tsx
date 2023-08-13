import Link from "next/link";
import { css } from "../styled-system/css";

export default function IndexRoute() {
  return (
    <body className={css({ backgroundImage: "var(--gradient-background)" })}>
      <div
        className={`${css({
          minHeight: "inherit",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        })} container`}
      >
        <div
          className={`${css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "3rem",
            paddingBottom: "3rem",
          })} content`}
        >
          <h1
            className={css({
              margin: "0",
              textShadow: "0 3px 0 rgba(0, 0, 0, 0.75)",
              textAlign: "center",
              lineHeight: "0.5!",
              fontWeight: "bold!",
            })}
          >
            Next.js{" "}
            <span
              className={css({
                display: "block",
                fontSize: "4.5rem",
                lineHeight: "1",
                textTransform: "uppercase",
                textShadow:
                  "0 0.2em 0.5em rgba(0, 0, 0, 0.5), 0 5px 0 rgba(0, 0, 0, 0.75)",
                sm: {
                  fontSize: "6rem",
                },
                lg: {
                  fontSize: "8rem",
                },
              })}
            >
              J🤪kes!
            </span>
          </h1>
          <nav>
            <ul
              className={css({
                listStyle: "none",
                margin: "0",
                padding: "0",
                display: "flex",
                gap: "1rem",
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                lineHeight: "1",
                sm: {
                  fontSize: "1.25rem",
                  gap: "1.5rem",
                },
              })}
            >
              <li>
                <Link href="jokes" passHref legacyBehavior>
                  <a
                    className={css({
                      _hover: {
                        textDecorationStyle: "wavy!",
                        textDecorationThickness: "1px!",
                      },
                      fontWeight: "450",
                    })}
                  >
                    Read Jokes
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/api/rss" passHref legacyBehavior>
                  <a
                    className={css({
                      _hover: {
                        textDecorationStyle: "wavy!",
                        textDecorationThickness: "1px!",
                      },
                      fontWeight: "450",
                    })}
                  >
                    RSS
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </body>
  );
}
