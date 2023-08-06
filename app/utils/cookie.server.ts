import type { CookieParseOptions, CookieSerializeOptions } from "cookie";
import { parse, serialize } from "cookie";
import cookieSignature from "cookie-signature";

export interface SessionIdStorageStrategy<
  Data = SessionData,
  FlashData = Data,
> {
  /**
   * The Cookie used to store the session id, or options used to automatically
   * create one.
   */
  cookie?: Cookie | (CookieOptions & { name?: string });

  /**
   * Creates a new record with the given data and returns the session id.
   */
  createData: (
    data: FlashSessionData<Data, FlashData>,
    expires?: Date,
  ) => Promise<string>;

  /**
   * Returns data for a given session id, or `null` if there isn't any.
   */
  readData: (id: string) => Promise<FlashSessionData<Data, FlashData> | null>;

  /**
   * Updates data for the given session id.
   */
  updateData: (
    id: string,
    data: FlashSessionData<Data, FlashData>,
    expires?: Date,
  ) => Promise<void>;

  /**
   * Deletes data for a given session id from the data store.
   */
  deleteData: (id: string) => Promise<void>;
}

interface CookieSessionStorageOptions {
  /**
   * The Cookie used to store the session data on the client, or options used
   * to automatically create one.
   */
  cookie?: SessionIdStorageStrategy["cookie"];
}
export interface SessionData {
  [name: string]: any;
}
export interface Session<Data = SessionData, FlashData = Data> {
  /**
   * A unique identifier for this session.
   *
   * Note: This will be the empty string for newly created sessions and
   * sessions that are not backed by a database (i.e. cookie-based sessions).
   */
  readonly id: string;

  /**
   * The raw data contained in this session.
   *
   * This is useful mostly for SessionStorage internally to access the raw
   * session data to persist.
   */
  readonly data: FlashSessionData<Data, FlashData>;

  /**
   * Returns `true` if the session has a value for the given `name`, `false`
   * otherwise.
   */
  has(name: (keyof Data | keyof FlashData) & string): boolean;

  /**
   * Returns the value for the given `name` in this session.
   */
  get<Key extends (keyof Data | keyof FlashData) & string>(
    name: Key,
  ):
    | (Key extends keyof Data ? Data[Key] : undefined)
    | (Key extends keyof FlashData ? FlashData[Key] : undefined)
    | undefined;

  /**
   * Sets a value in the session for the given `name`.
   */
  set<Key extends keyof Data & string>(name: Key, value: Data[Key]): void;

  /**
   * Sets a value in the session that is only valid until the next `get()`.
   * This can be useful for temporary values, like error messages.
   */
  flash<Key extends keyof FlashData & string>(
    name: Key,
    value: FlashData[Key],
  ): void;

  /**
   * Removes a value from the session.
   */
  unset(name: keyof Data & string): void;
}
export interface SessionStorage<Data = SessionData, FlashData = Data> {
  /**
   * Parses a Cookie header from a HTTP request and returns the associated
   * Session. If there is no session associated with the cookie, this will
   * return a new Session with no data.
   */
  getSession: (
    cookieHeader?: string | null,
    options?: CookieParseOptions,
  ) => Promise<Session<Data, FlashData>>;

  /**
   * Stores all data in the Session and returns the Set-Cookie header to be
   * used in the HTTP response.
   */
  commitSession: (
    session: Session<Data, FlashData>,
    options?: CookieSerializeOptions,
  ) => Promise<string>;

  /**
   * Deletes all data associated with the Session and returns the Set-Cookie
   * header to be used in the HTTP response.
   */
  destroySession: (
    session: Session<Data, FlashData>,
    options?: CookieSerializeOptions,
  ) => Promise<string>;
}
export type CreateCookieSessionStorageFunction = <
  Data = SessionData,
  FlashData = Data,
>(
  options?: CookieSessionStorageOptions,
) => SessionStorage<Data, FlashData>;

export interface CookieSignatureOptions {
  /**
   * An array of secrets that may be used to sign/unsign the value of a cookie.
   *
   * The array makes it easy to rotate secrets. New secrets should be added to
   * the beginning of the array. `cookie.serialize()` will always use the first
   * value in the array, but `cookie.parse()` may use any of them so that
   * cookies that were signed with older secrets still work.
   */
  secrets?: string[];
}

export type CookieOptions = CookieParseOptions &
  CookieSerializeOptions &
  CookieSignatureOptions;

export interface Cookie {
  /**
   * The name of the cookie, used in the `Cookie` and `Set-Cookie` headers.
   */
  readonly name: string;

  /**
   * True if this cookie uses one or more secrets for verification.
   */
  readonly isSigned: boolean;

  /**
   * The Date this cookie expires.
   *
   * Note: This is calculated at access time using `maxAge` when no `expires`
   * option is provided to `createCookie()`.
   */
  readonly expires?: Date;

  /**
   * Parses a raw `Cookie` header and returns the value of this cookie or
   * `null` if it's not present.
   */
  parse(
    cookieHeader: string | null,
    options?: CookieParseOptions,
  ): Promise<any>;

  /**
   * Serializes the given value to a string and returns the `Set-Cookie`
   * header.
   */
  serialize(value: any, options?: CookieSerializeOptions): Promise<string>;
}

export type CreateCookieFunction = (
  name: string,
  cookieOptions?: CookieOptions,
) => Cookie;
async function encodeCookieValue(
  sign: SignFunction,
  value: any,
  secrets: string[],
): Promise<string> {
  let encoded = encodeData(value);

  if (secrets.length > 0) {
    encoded = await sign(encoded, secrets[0]);
  }

  return encoded;
}
async function decodeCookieValue(
  unsign: UnsignFunction,
  value: string,
  secrets: string[],
): Promise<any> {
  if (secrets.length > 0) {
    for (const secret of secrets) {
      const unsignedValue = await unsign(value, secret);
      if (unsignedValue !== false) {
        return decodeData(unsignedValue);
      }
    }

    return null;
  }

  return decodeData(value);
}
function myEscape(value: string): string {
  const str = value.toString();
  let result = "";
  let index = 0;
  let chr;
  let code;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (/[\w*+\-./@]/.exec(chr)) {
      result += chr;
    } else {
      code = chr.charCodeAt(0);
      if (code < 256) {
        result += `%${hex(code, 2)}`;
      } else {
        result += `%u${hex(code, 4).toUpperCase()}`;
      }
    }
  }
  return result;
}

function hex(code: number, length: number): string {
  let result = code.toString(16);
  while (result.length < length) result = `0${result}`;
  return result;
}
function myUnescape(value: string): string {
  const str = value.toString();
  let result = "";
  let index = 0;
  let chr;
  let part;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (chr === "%") {
      if (str.charAt(index) === "u") {
        part = str.slice(index + 1, index + 5);
        if (/^[\da-f]{4}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16));
          index += 5;
          continue;
        }
      } else {
        part = str.slice(index, index + 2);
        if (/^[\da-f]{2}$/i.exec(part)) {
          result += String.fromCharCode(parseInt(part, 16));
          index += 2;
          continue;
        }
      }
    }
    result += chr;
  }
  return result;
}
function encodeData(value: any): string {
  return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))));
}

function decodeData(value: string): any {
  try {
    return JSON.parse(decodeURIComponent(myEscape(atob(value))));
  } catch (error: unknown) {
    return {};
  }
}

export const createCookieFactory =
  ({
    sign,
    unsign,
  }: {
    sign: SignFunction;
    unsign: UnsignFunction;
  }): CreateCookieFunction =>
  (name, cookieOptions = {}) => {
    const { secrets = [], ...options } = {
      path: "/",
      sameSite: "lax" as const,
      ...cookieOptions,
    };

    warnOnceAboutExpiresCookie(name, options.expires);

    return {
      get name() {
        return name;
      },
      get isSigned() {
        return secrets.length > 0;
      },
      get expires() {
        // Max-Age takes precedence over Expires
        return typeof options.maxAge !== "undefined"
          ? new Date(Date.now() + options.maxAge * 1000)
          : options.expires;
      },
      async parse(cookieHeader, parseOptions) {
        if (!cookieHeader) return null;
        const cookies = parse(cookieHeader, { ...options, ...parseOptions });
        return name in cookies
          ? cookies[name] === ""
            ? ""
            : await decodeCookieValue(unsign, cookies[name], secrets)
          : null;
      },
      async serialize(value, serializeOptions) {
        return serialize(
          name,
          value === "" ? "" : await encodeCookieValue(sign, value, secrets),
          {
            ...options,
            ...serializeOptions,
          },
        );
      },
    };
  };

export type IsCookieFunction = (object: any) => object is Cookie;

/**
 * Returns true if an object is a Remix cookie container.
 *
 * @see https://remix.run/utils/cookies#iscookie
 */
export const isCookie: IsCookieFunction = (object): object is Cookie => {
  return (
    object != null &&
    typeof object.name === "string" &&
    typeof object.isSigned === "boolean" &&
    typeof object.parse === "function" &&
    typeof object.serialize === "function"
  );
};
export type FlashSessionData<Data, FlashData> = Partial<
  Data & {
    [Key in keyof FlashData as FlashDataKey<Key & string>]: FlashData[Key];
  }
>;
type FlashDataKey<Key extends string> = `__flash_${Key}__`;
function flash<Key extends string>(name: Key): FlashDataKey<Key> {
  return `__flash_${name}__`;
}

export type CreateSessionFunction = <Data = SessionData, FlashData = Data>(
  initialData?: Data,
  id?: string,
) => Session<Data, FlashData>;
export const createSession: CreateSessionFunction = <
  Data = SessionData,
  FlashData = Data,
>(
  initialData: Partial<Data> = {},
  id = "",
): Session<Data, FlashData> => {
  const map = new Map(Object.entries(initialData)) as Map<
    keyof Data | FlashDataKey<keyof FlashData & string>,
    any
  >;
  console.log("createSession");
  console.log(initialData);
  return {
    get id() {
      return id;
    },
    get data() {
      return Object.fromEntries(map) as FlashSessionData<Data, FlashData>;
    },
    has(name) {
      return (
        map.has(name as keyof Data) ||
        map.has(flash(name as keyof FlashData & string))
      );
    },
    get(name) {
      console.log("GET");
      console.log(map);
      if (map.has(name as keyof Data)) return map.get(name as keyof Data);

      const flashName = flash(name as keyof FlashData & string);
      console.log(flashName);
      console.log(map);
      if (map.has(flashName)) {
        const value = map.get(flashName);
        map.delete(flashName);
        return value;
      }

      return undefined;
    },
    set(name, value) {
      map.set(name, value);
    },
    flash(name, value) {
      map.set(flash(name), value);
    },
    unset(name) {
      map.delete(name);
    },
  };
};

export function warnOnceAboutSigningSessionCookie(cookie: Cookie) {
  warnOnce(
    cookie.isSigned,
    `The "${cookie.name}" cookie is not signed, but session cookies should be ` +
      `signed to prevent tampering on the client before they are sent back to the ` +
      `server. See https://remix.run/utils/cookies#signing-cookies ` +
      `for more information.`,
  );
}

export const createCookieSessionStorageFactory =
  (createCookie: CreateCookieFunction): CreateCookieSessionStorageFunction =>
  ({ cookie: cookieArg } = {}) => {
    const cookie = isCookie(cookieArg)
      ? cookieArg
      : createCookie(cookieArg?.name || "__session", cookieArg);

    warnOnceAboutSigningSessionCookie(cookie);

    return {
      async getSession(cookieHeader, options) {
        return createSession(
          (cookieHeader && (await cookie.parse(cookieHeader, options))) || {},
        );
      },
      async commitSession(session, options) {
        const serializedCookie = await cookie.serialize(session.data, options);
        if (serializedCookie.length > 4096) {
          throw new Error(
            "Cookie length will exceed browser maximum. Length: " +
              serializedCookie.length,
          );
        }
        return serializedCookie;
      },
      async destroySession(_session, options) {
        return cookie.serialize("", {
          ...options,
          expires: new Date(0),
        });
      },
    };
  };

export type SignFunction = (value: string, secret: string) => Promise<string>;

export type UnsignFunction = (
  cookie: string,
  secret: string,
) => Promise<string | false>;

export const sign: SignFunction = async (value, secret) => {
  return cookieSignature.sign(value, secret);
};

export const unsign: UnsignFunction = async (
  signed: string,
  secret: string,
) => {
  return cookieSignature.unsign(signed, secret);
};

export const createCookie = createCookieFactory({ sign, unsign });
export const createCookieSessionStorage =
  createCookieSessionStorageFactory(createCookie);

function warnOnceAboutExpiresCookie(name: string, expires?: Date) {
  warnOnce(
    !expires,
    `The "${name}" cookie has an "expires" property set. ` +
      `This will cause the expires value to not be updated when the session is committed. ` +
      `Instead, you should set the expires value when serializing the cookie. ` +
      `You can use \`commitSession(session, { expires })\` if using a session storage object, ` +
      `or \`cookie.serialize("value", { expires })\` if you're using the cookie directly.`,
  );
}

const alreadyWarned: { [message: string]: boolean } = {};

export function warnOnce(condition: boolean, message: string): void {
  if (!condition && !alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}
