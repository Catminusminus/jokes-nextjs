import "./global-large.css";
import "./global-medium.css";
import "./global.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const description = "Learn Next.js and laugh at the same time!";

export const metadata: Metadata = {
  title: "Next.js: So great, it's funny!",
  description,
  twitter: {
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
