const FALLBACK_TIMEOUT_MS = 5000;
const DEFAULT_LOCAL_API_BASE = "http://127.0.0.1:8000";

const envDeployedBase =
  globalThis.process?.env?.REACT_APP_API_URL ||
  import.meta.env?.VITE_API_URL ||
  globalThis.window?.__API_BASE__;

const envLocalBase =
  globalThis.process?.env?.REACT_APP_LOCAL_API_URL ||
  import.meta.env?.VITE_LOCAL_API_URL;

const normalizeBase = (base) => (base || "").replace(/\/+$/, "");

export const DEPLOYED_API_BASE = normalizeBase(envDeployedBase);
export const LOCAL_API_BASE = normalizeBase(envLocalBase || DEFAULT_LOCAL_API_BASE);

const isLocalHost = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const buildApiUrl = (base, path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBase(base)}${normalizedPath}`;
};

const fetchWithTimeout = async (url, init, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const shouldUseLocalOnly = () => {
  if (typeof window === "undefined") return true;
  return isLocalHost(window.location.hostname);
};

const logApiError = (phase, url, error) => {
  const message = error?.message || String(error);
  console.error(`[api] ${phase} ${url} :: ${message}`, error);
};

export const apiFetch = async (path, init = {}) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(path);

  if (isAbsoluteUrl) {
    return fetchWithTimeout(path, init, FALLBACK_TIMEOUT_MS);
  }

  const localOnly = shouldUseLocalOnly();

  const primaryBase = localOnly ? LOCAL_API_BASE : DEPLOYED_API_BASE;

  if (!primaryBase) {
    throw new Error(
      localOnly
        ? "Missing local API base URL."
        : "Missing deployed API base URL. Set REACT_APP_API_URL or VITE_API_URL."
    );
  }

  const primaryUrl = buildApiUrl(primaryBase, path);

  try {
    return await fetchWithTimeout(primaryUrl, init, FALLBACK_TIMEOUT_MS);
  } catch (error) {
    logApiError("request failed", primaryUrl, error);
    throw error;
  }
};

export const API_BASE =
  shouldUseLocalOnly() ? LOCAL_API_BASE : DEPLOYED_API_BASE;

export default {
  API_BASE,
  DEPLOYED_API_BASE,
  LOCAL_API_BASE,
  apiFetch,
};