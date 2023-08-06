"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  console.log(error);
  return (
    <div className="error-container">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
