// The ONLY file that touches the token in localStorage.
const TOKEN_KEY = "token";

// Fired by the axios interceptor when the API answers 401.
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
