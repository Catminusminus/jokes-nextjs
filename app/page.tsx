import Link from "next/link";

import "./index.css";

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Next.js <span>J🤪kes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href="jokes">Read Jokes</Link>
            </li>
            <li>
              <Link href="/api/rss">RSS</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
