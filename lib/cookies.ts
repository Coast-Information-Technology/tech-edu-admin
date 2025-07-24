import { parse, serialize } from "cookie";

/**
 * Cookie keys for storing tokens.
 */
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Saves the provided token to the browser's cookies.
 * This function should only be executed on the client side.
 * @param token - The token to be saved in the cookies.
 * @returns True if the token was successfully saved, false otherwise.
 */
export const saveTokenToCookies = (token: string): boolean => {
  try {
    if (typeof document === "undefined") return false; // Client-side check

    const cookie = serialize(TOKEN_KEY, encodeURIComponent(token), {
      httpOnly: false, // JavaScript-accessible
      secure: process.env.NODE_ENV !== "development", // Use secure flag in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 60 * 60 * 24 * 2, // 2 days (48h) to match access_token expiry
      path: "/", // Accessible throughout the site
    });

    document.cookie = cookie;
    return true;
  } catch (error) {
    console.error("Failed to save token to cookies:", error);
    return false;
  }
};

/**
 * Saves the refresh token to the browser's cookies.
 * This function should only be executed on the client side.
 * @param refreshToken - The refresh token to be saved in the cookies.
 * @returns True if the refresh token was successfully saved, false otherwise.
 */
export const saveRefreshTokenToCookies = (refreshToken: string): boolean => {
  try {
    if (typeof document === "undefined") return false; // Client-side check

    const cookie = serialize(
      REFRESH_TOKEN_KEY,
      encodeURIComponent(refreshToken),
      {
        httpOnly: false, // JavaScript-accessible
        secure: process.env.NODE_ENV !== "development", // Use secure flag in production
        sameSite: "strict", // Protect against CSRF
        maxAge: 60 * 60 * 24 * 7, // 7 days to match refresh_expires_in
        path: "/", // Accessible throughout the site
      }
    );

    document.cookie = cookie;
    return true;
  } catch (error) {
    console.error("Failed to save refresh token to cookies:", error);
    return false;
  }
};

/**
 * Retrieves the token from browser cookies.
 * This function should only be executed on the client side.
 * @returns The token string if found, otherwise null.
 */
export const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = parse(document.cookie || "");
  const token = cookies[TOKEN_KEY];
  return token ? decodeURIComponent(token) : null;
};

/**
 * Retrieves the refresh token from browser cookies.
 * This function should only be executed on the client side.
 * @returns The refresh token string if found, otherwise null.
 */
export const getRefreshTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = parse(document.cookie || "");
  const refreshToken = cookies[REFRESH_TOKEN_KEY];
  return refreshToken ? decodeURIComponent(refreshToken) : null;
};

/**
 * Deletes the token from browser cookies.
 * This function should only be executed on the client side.
 * @returns True if the token was removed successfully, false otherwise.
 */
export const deleteTokenFromCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const expiredCookie = serialize(TOKEN_KEY, "", {
      maxAge: -1, // Expire immediately
      path: "/",
    });

    document.cookie = expiredCookie;
    return true;
  } catch (error) {
    console.error("Failed to delete token from cookies:", error);
    return false;
  }
};

/**
 * Deletes the refresh token from browser cookies.
 * This function should only be executed on the client side.
 * @returns True if the refresh token was removed successfully, false otherwise.
 */
export const deleteRefreshTokenFromCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const expiredCookie = serialize(REFRESH_TOKEN_KEY, "", {
      maxAge: -1, // Expire immediately
      path: "/",
    });

    document.cookie = expiredCookie;
    return true;
  } catch (error) {
    console.error("Failed to delete refresh token from cookies:", error);
    return false;
  }
};

/**
 * Clears all cookies from the browser.
 * This function should only be executed on the client side.
 * @returns True if all cookies were cleared successfully, false otherwise.
 */
export const clearAllCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    // Get all cookies
    const cookies = parse(document.cookie || "");

    // Delete each cookie by setting it to expire immediately
    Object.keys(cookies).forEach((cookieName) => {
      const expiredCookie = serialize(cookieName, "", {
        maxAge: -1, // Expire immediately
        path: "/",
      });
      document.cookie = expiredCookie;

      // Also try with different paths to ensure complete removal
      const expiredCookieRoot = serialize(cookieName, "", {
        maxAge: -1,
        path: "/",
      });
      document.cookie = expiredCookieRoot;
    });

    // Also clear common auth-related cookies explicitly
    const commonAuthCookies = [
      "token",
      "refreshToken",
      "userData",
      "userId",
      "authToken",
      "session",
      "accessToken",
    ];

    commonAuthCookies.forEach((cookieName) => {
      const expiredCookie = serialize(cookieName, "", {
        maxAge: -1,
        path: "/",
      });
      document.cookie = expiredCookie;
    });

    return true;
  } catch (error) {
    console.error("Failed to clear all cookies:", error);
    return false;
  }
};

/**
 * Saves both access and refresh tokens to cookies.
 * This function should only be executed on the client side.
 * @param accessToken - The access token to be saved.
 * @param refreshToken - The refresh token to be saved.
 * @returns True if both tokens were successfully saved, false otherwise.
 */
export const saveTokensToCookies = (
  accessToken: string,
  refreshToken: string
): boolean => {
  const accessTokenSaved = saveTokenToCookies(accessToken);
  const refreshTokenSaved = saveRefreshTokenToCookies(refreshToken);
  return accessTokenSaved && refreshTokenSaved;
};

/**
 * Client-side cookie utilities
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookies = parse(document.cookie || "");
  return cookies[name];
};

export const setCookie = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
    path?: string;
  } = {}
) => {
  if (typeof document === "undefined") return;

  const cookie = serialize(name, value, {
    httpOnly: false, // Client-side cookies can't be httpOnly
    secure: options.secure ?? process.env.NODE_ENV === "production",
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge ?? 7 * 24 * 60 * 60, // 7 days
    path: options.path ?? "/",
  });

  document.cookie = cookie;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;

  const expiredCookie = serialize(name, "", {
    maxAge: -1, // Expire immediately
    path: "/",
  });

  document.cookie = expiredCookie;
};

// Delete userId cookie
export function deleteUserIdFromCookies() {
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Delete userData cookie
export function deleteUserDataFromCookies() {
  document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
