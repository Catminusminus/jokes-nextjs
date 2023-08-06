"use client";
import Link from "next/link";
import { loader } from "./loader";
import { RandomLink } from "./client";
import { RecoilRoot } from "recoil";
import type { PropsWithChildren } from "react";

export function ClientRoot({
  data,
  children,
}: PropsWithChildren<{ data: Awaited<ReturnType<typeof loader>> }>) {
  return (
    <RecoilRoot>
      <div className="jokes-list">
        <RandomLink data={data} />
        <Link href="/jokes/new" className="button">
          Add your own
        </Link>
      </div>
      <div className="jokes-outlet">{children}</div>
    </RecoilRoot>
  );
}
