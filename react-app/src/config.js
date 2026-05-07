const FALLBACK_TIMEOUT_MS = 5000;
const DEFAULT_LOCAL_API_BASE = "http://127.0.0.1:8000";

const envDeployedBase =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== "undefined" && window.__API_BASE__);

const envLocalBase =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_LOCAL_API_URL) ||
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_LOCAL_API_URL);

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
  const fallbackBase = localOnly ? "" : LOCAL_API_BASE;

  if (!primaryBase) {
    const message = "Missing deployed API base; falling back to local.";
    console.error(`[api] ${message}`);
    if (!fallbackBase) {
      throw new Error(message);
    }
  }

  const primaryUrl = buildApiUrl(primaryBase || fallbackBase, path);

  try {
    return await fetchWithTimeout(primaryUrl, init, FALLBACK_TIMEOUT_MS);
  } catch (error) {
    if (!fallbackBase || primaryBase === fallbackBase) {
      logApiError("primary failed", primaryUrl, error);
      throw error;
    }

    logApiError("primary failed, trying local", primaryUrl, error);
    const fallbackUrl = buildApiUrl(fallbackBase, path);
    return fetchWithTimeout(fallbackUrl, init, FALLBACK_TIMEOUT_MS);
  }
};

export const API_BASE = DEPLOYED_API_BASE || LOCAL_API_BASE;

export default {
  API_BASE,
  DEPLOYED_API_BASE,
  LOCAL_API_BASE,
  apiFetch,
};