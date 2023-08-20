import Link from "next/link";
import { css } from "excss";

export default function IndexRoute() {
  return (
    <body className={css`background-image: var(--gradient-background);`}>
      <div
        className={`${css`
          min-height: inherit;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;`} container`}
      >
        <div
          className={`${css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 3rem;
            padding-bottom: 3rem;`} content`}
        >
          <h1
            className={css`
              margin: 0;
              text-shadow: 0 3px 0 rgba(0, 0, 0, 0.75);
              text-align: center;
              line-height: 0.5;
              font-weight: bold;
          `}
          >
            Next.js{" "}
            <span
              className={css`
                display: block;
                font-size: 4.5rem;
                line-height: 1;
                text-transform: uppercase;
                text-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.5), 0 5px 0 rgba(0, 0, 0, 0.75);
                @media print, (min-width: 640px) {
                  font-size: 6rem;
                }
                @media screen and (min-width: 1024px) {
                  font-size: 8rem;
                }`}
            >
              J🤪kes!
            </span>
          </h1>
          <nav>
            <ul
              className={css`
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                gap: 1rem;
                font-family: var(--font-display);
                font-size: 1.125rem;
                line-height: 1;
                @media print, (min-width: 640px) {
                  font-size: 1.25rem;
                  gap: 1.5rem;
                }`}
            >
              <li>
                <Link href="jokes" passHref legacyBehavior>
                  <a
                    className={css`&:hover {
                      text-decoration-style: wavy;
                      text-decoration-thickness: 1px;
                    }`}
                  >
                    Read Jokes
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/api/rss" passHref legacyBehavior>
                  <a
                    className={css`&:hover {
                      text-decoration-style: wavy;
                      text-decoration-thickness: 1px;
                    }`}
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
