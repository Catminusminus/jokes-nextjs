import { Metadata } from "next";
import { css } from "../../styled-system/css";

const description = "Login to submit your own jokes to Next.js Jokes!";

export const metadata: Metadata = {
  title: "Next.js Jokes | Login",
  description,
  twitter: {
    description,
  },
};

export default function LoginRoute({
  children,
}: { children: React.ReactNode }) {
  return (
    <body className={css({ backgroundImage: "var(--gradient-background)" })}>
      {children}
    </body>
  );
}
