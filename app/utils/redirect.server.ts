const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { requestAsyncStorage } from "next/dist/client/components/request-async-storage";

export enum RedirectType {
  push = "push",
  replace = "replace",
}

type RedirectError<U extends string> = Error & {
  digest: `${typeof REDIRECT_ERROR_CODE};${RedirectType};${U}`;
  mutableCookies: ResponseCookies;
};

function getRedirectErrorWithCookie(
  url: string,
  cookies: Record<string, string>,
  type: RedirectType,
): RedirectError<typeof url> {
  const error = new Error(REDIRECT_ERROR_CODE) as RedirectError<typeof url>;
  error.digest = `${REDIRECT_ERROR_CODE};${type};${url}`;
  const requestStore = requestAsyncStorage.getStore();
  if (requestStore) {
    error.mutableCookies = requestStore.mutableCookies;
  }
  console.log(error.mutableCookies);
  for (const key in cookies) {
    if (error.mutableCookies.get(key) !== undefined) {
      error.mutableCookies.delete(key);
    }
    error.mutableCookies.set(key, cookies[key]);
  }
  console.log(error.mutableCookies);

  return error;
}

export function redirectWithCookie(
  url: string,
  cookies: Record<string, string>,
  type: RedirectType = RedirectType.replace,
): never {
  throw getRedirectErrorWithCookie(url, cookies, type);
}
