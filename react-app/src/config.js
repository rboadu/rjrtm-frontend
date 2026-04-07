export const API_BASE =
  // Node/process (only if present at build/runtime)
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  // Vite runtime env
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  // Optional window-level override (useful for non-bundled scripts)
  (typeof window !== "undefined" && window.__API_BASE__) ||
  // Fallback default
  "http://127.0.0.1:8000";

export default { API_BASE };