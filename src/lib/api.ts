// AmazeCC API on Cloudflare Workers (Hono) - club-admin + remote VTOP.
import { getAccessTokenSync, signOutOidc } from "./oauth2";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hono.amazecc.com";

// Amaze ID (auth.amazecc.com) — club identity. A club-rep session is a plain
// Amaze ID session whose user has a linked VTOP profile in `vtopRegNo`.
export const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.amazecc.com";

export function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getClubToken() {
  if (typeof window === "undefined") return null;
  // OIDC access token (authorization_code + PKCE); refresh happens in oauth2.ts
  // (ensureFreshAccessToken, called on app mount).
  return getAccessTokenSync();
}

export async function signOut() {
  // Revoke the OAuth tokens at the IdP, then drop local state. The IdP session
  // stays alive so the next sign-in is a silent SSO hop.
  await signOutOidc();
  localStorage.removeItem("club_roles");
  localStorage.removeItem("active_club_id");
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
