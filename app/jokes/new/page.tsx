"use client";

import {
  useState,
  useTransition,
  experimental_useOptimistic as useOptimistic,
} from "react";
import { action } from "./action";
import { usePathname, useParams } from "next/navigation";
import { JokeDisplay } from "../components/joke";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "That joke is too short";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke's name is too short";
  }
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export default function NewJokeRoute() {
  const [actionData, setActionData] = useState<Awaited<
    ReturnType<typeof action>
  > | null>(null);
  const path = usePathname();
  const [_, startTransition] = useTransition();
  const [optimisticJoke, addOptimisticJoke] = useOptimistic<
    FormData | null,
    FormData
  >(null, (state, newJoke) => newJoke);
  const jokeId = useParams();
  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      addOptimisticJoke(formData);
      const res = await action(formData);
      setActionData(res);
    });
  };
  if (optimisticJoke) {
    const content = optimisticJoke.get("content");
    const name = optimisticJoke.get("name");
    if (
      typeof content === "string" &&
      typeof name === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          canDelete={false}
          isOwner={true}
          joke={{ name, content }}
          jokeId={jokeId.jokeId}
        />
      );
    }
  }
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form action={handleAction}>
        <div>
          <input type="hidden" name="url" value={path} />
          <label>
            Name:{" "}
            <input
              defaultValue={actionData?.fields?.name}
              type="text"
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" id="name-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(actionData?.fieldErrors?.content)}
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
