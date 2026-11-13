// AmazeCC API on Cloudflare Workers (Hono) - club-admin + remote VTOP.
import { getAccessTokenSync, handleUnauthorized } from "./oauth2";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hono.amazecc.com";

// Amaze ID (auth.amazecc.com) — club identity. A club-rep session is a plain
// Amaze ID session whose user has a linked VTOP profile in `vtopRegNo`.
export const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.amazecc.com";

export function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getClubToken() {
  if (typeof window === "undefined") return null;
  // OIDC access token (authorization_code + PKCE). Renewal is a silent
  // prompt=none re-authorization (see oauth2.ts: handleUnauthorized).
  return getAccessTokenSync();
}

export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getClubToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (typeof window !== "undefined") {
    const activeClubId = localStorage.getItem("active_club_id");
    if (activeClubId && !headers.has("X-Club-Id")) {
      headers.set("X-Club-Id", activeClubId);
    }
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
  }).then((res) => {
    // Access token expired mid-session: re-authorize silently.
    if (res.status === 401) handleUnauthorized();
    return res;
  });
}

export const fetcher = async (path: string) => {
  const res = await apiFetch(path);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as Error & { info?: unknown; status?: number };
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }

  return res.json();
};
