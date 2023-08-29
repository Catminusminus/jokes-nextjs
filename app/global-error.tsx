"use client";

import "./global.css";
import "./global-medium.css";
import "./global-large.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { css } from "excss";

const inter = Inter({ subsets: ["latin"] });

const description = "Learn Next.js and laugh at the same time!";

export const metadata: Metadata = {
  title: "Uh-oh!",
  description,
  twitter: {
    description,
  },
};

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className={css`background-image: var(--gradient-background);`}>
        <div className="error-container">
          <h1>App Error</h1>
          <pre>{error.message}</pre>
        </div>
      </body>
    </html>
  );
}
