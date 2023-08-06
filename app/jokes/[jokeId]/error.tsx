"use client";

import { useParams } from "next/navigation";

export default function ErrorBoundary() {
  const jokeId = useParams();
  return (
    <div className="error-container">
      There was an error loading joke by the id &quot;{jokeId.jokeId}&quot;.
      Sorry.
    </div>
  );
}
