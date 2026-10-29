// Shared by client and server code. Keep this file free of server-only imports.

export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,24}$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_REGEX.test(value);
}

// Allows only same-site paths such as "/manhwa/x". Blocks open redirects like "//evil.com".
export function safeNext(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
