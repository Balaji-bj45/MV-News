import type { AuthTokens, AuthUser, JwtPayload } from '../types';

export const AUTH_LOGOUT_EVENT = 'mv-news-auth-logout';

let accessToken: string | null = null;
let refreshToken: string | null = null;

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const base64Value = token.split('.')[1];
    if (!base64Value) {
      return null;
    }

    const normalized = base64Value.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = window.atob(normalized);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export const setTokens = ({ accessToken: nextAccessToken, refreshToken: nextRefreshToken }: AuthTokens) => {
  accessToken = nextAccessToken;

  if (typeof nextRefreshToken !== 'undefined') {
    refreshToken = nextRefreshToken ?? null;
  }
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const emitForcedLogout = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }
};

export const userFromAccessToken = (token: string, previousUser?: AuthUser | null): AuthUser | null => {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const keepProfile = previousUser?.id === payload.id ? previousUser : null;

  return {
    id: payload.id,
    role: payload.role,
    name: keepProfile?.name,
    email: keepProfile?.email,
  };
};
