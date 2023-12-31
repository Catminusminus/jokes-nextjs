"use client";
import Link from "next/link";
import { loader } from "./loader";
import { RandomLink } from "./client";
import { RecoilRoot } from "recoil";
import type { PropsWithChildren } from "react";
import { css } from "excss";

export function ClientRoot({
  data,
  children,
}: PropsWithChildren<{ data: Awaited<ReturnType<typeof loader>> }>) {
  return (
    <RecoilRoot>
      <div
        className={`${css`
          max-width: 12rem;
        `} jokes-list`}
      >
        <RandomLink data={data} />
        <Link
          href="/jokes/new"
          className={`${css`
            margin-block-start: 16px;
          `} button`}
        >
          Add your own
        </Link>
      </div>
      <div
        className={`${css`
          flex: 1;
        `} jokes-outlet`}
      >
        {children}
      </div>
    </RecoilRoot>
  );
}
