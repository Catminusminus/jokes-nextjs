"use client";

import Link from "next/link";

export default function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
