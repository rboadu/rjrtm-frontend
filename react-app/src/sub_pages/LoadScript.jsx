import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/button";
import { API_BASE } from "../config";
import countriesData from "../data/countries.json";
import statesByCountry from "../data/states_by_country.json";
import citiesByState from "../data/cities_by_state.json";

export default function LoadScript() {
const [apiBaseUrl] = useState(API_BASE ?? "");
  const [status, setStatus] = useState("Ready.");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

async function fetchJson(baseOrUrl, init = {}) {
  let url = "";
  let options = { ...init };

  if (typeof baseOrUrl === "string") {
    url = baseOrUrl;
  } else if (baseOrUrl && typeof baseOrUrl === "object") {
    url = baseOrUrl.url || baseOrUrl.href || String(baseOrUrl);
    if (baseOrUrl.method) options.method = baseOrUrl.method;
  } else {
    url = String(baseOrUrl);
  }

  if (/^\/\//.test(url)) url = window.location.protocol + url;
  const isAbsolute = /^https?:\/\//i.test(url);
  const fullUrl = isAbsolute
    ? url
    : apiBaseUrl
      ? apiBaseUrl.replace(/\/+$/, "") + (url.startsWith("/") ? url : `/${url}`)
      : (url.startsWith("/") ? url : `/${url}`);
  // debug log
  console.info("[LoadScript] fetch:", { fullUrl, options });

  try {
    const res = await fetch(fullUrl, options);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      const errMsg = `${res.status} ${res.statusText}: ${text}`;
      console.error("[LoadScript] fetch error:", errMsg);
      throw new Error(errMsg);
    }

    const contentType = res.headers.get?.("content-type") || "";
    if (contentType.includes("application/json")) return await res.json();
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }  catch (err) {
    console.error("[LoadScript] fetchJson failed for", fullUrl, err);
    // throw an error that includes the URL so calling code can show it
    throw new Error((err && err.message ? err.message : String(err)) + " (url: " + fullUrl + ")");
  }

}

  const handleLoadCountries = useCallback(async () => {
  setStatus("Loading countries...");
  setIsError(false);
  setLoading(true);
  try {
    // try API first
    let data = [];
    try {
      data = await fetchJson("/countries/");
    } catch (err) {
      // fallback to local static file (imported)
      console.warn("[LoadScript] countries fetch failed, using local data", err);
      data = countriesData;
    }
    setCountries(data || []);
    setStatus("Countries loaded");
  } catch (e) {
    setStatus("Error loading countries: " + e.message);
    setIsError(true);
  } finally {
    setLoading(false);
  }
}, [/* keep deps if needed */]);

// replace handleSelectCountry to use HATEOAS or fallback mapping
// ...existing code...
async function handleSelectCountry(value) {
  setSelectedCountry(value);
  setStates([]);
  setCities([]);
  setSelectedState(null);
  setStatus("Loading states...");
  setIsError(false);

  try {
    const country = countries.find(
      (c) => (c.code || c.id || c.name) === value
    );

    let statesUrl = null;
    if (country && country._links && country._links.states) {
      statesUrl = country._links.states.href;
    }

    let statesData = [];
    if (statesUrl) {
      statesData = await fetchJson(statesUrl);
    } else {
      // robust lookup in statesByCountry:
      const candidates = [
        value,
        country && country.name,
        country && country.code,
        country && country.id,
      ].filter(Boolean).map(String);

      // try exact keys
      for (const k of candidates) {
        if (statesByCountry[k]) {
          statesData = statesByCountry[k];
          break;
        }
      }

      // case-insensitive exact key
      if (!statesData.length) {
        const key = Object.keys(statesByCountry).find(
          (k) => k.toLowerCase() === String(value).toLowerCase()
        );
        if (key) statesData = statesByCountry[key];
      }

      // substring match (fallback)
      if (!statesData.length && country && country.name) {
        const key = Object.keys(statesByCountry).find((k) =>
          k.toLowerCase().includes(String(country.name).toLowerCase()) ||
          String(country.name).toLowerCase().includes(k.toLowerCase())
        );
        if (key) statesData = statesByCountry[key];
      }
    }

    setStates(statesData || []);
    setStatus(statesData && statesData.length ? "States loaded" : "No states found");
  } catch (e) {
    setStatus("Error loading states: " + e.message);
    setIsError(true);
  }
}

async function handleSelectState(value) {
  setSelectedState(value);
  setCities([]);
  setStatus("Loading cities...");
  setIsError(false);

  try {
    const stateObj = states.find((s) => (s.code || s.id || s.name) === value);
    let citiesUrl = stateObj && stateObj._links && stateObj._links.cities ? stateObj._links.cities.href : null;

    let citiesData = [];
    if (citiesUrl) {
      citiesData = await fetchJson(citiesUrl);
    } else {
      // robust lookup in citiesByState
      const candidates = [value, stateObj && stateObj.name].filter(Boolean).map(String);

      for (const k of candidates) {
        if (citiesByState[k]) {
          citiesData = citiesByState[k];
          break;
        }
      }

      if (!citiesData.length) {
        const key = Object.keys(citiesByState).find(
          (k) => k.toLowerCase() === String(value).toLowerCase()
        );
        if (key) citiesData = citiesByState[key];
      }

      if (!citiesData.length && stateObj && stateObj.name) {
        const key = Object.keys(citiesByState).find((k) =>
          k.toLowerCase().includes(String(stateObj.name).toLowerCase()) ||
          String(stateObj.name).toLowerCase().includes(k.toLowerCase())
        );
        if (key) citiesData = citiesByState[key];
      }
    }

    setCities(citiesData || []);
    setStatus(citiesData && citiesData.length ? "Cities loaded" : "No cities found");
  } catch (e) {
    setStatus("Error loading cities: " + e.message);
    setIsError(true);
  }
}
// ...existing code...
async function deleteItem(item) {
  // prefer item's self link if available
  const path = item && item._links && item._links.self ? item._links.self.href : null;
  if (!path) {
    setStatus("Delete failed: no endpoint available for item");
    setIsError(true);
    return;
  }

  // build a deleteUrl that works with empty apiBaseUrl (use relative paths for Vite proxy)
  const deleteUrl = /^https?:\/\//i.test(path)
    ? path
    : apiBaseUrl
      ? apiBaseUrl.replace(/\/+$/, "") + (path.startsWith("/") ? path : `/${path}`)
      : (path.startsWith("/") ? path : `/${path}`);

  try {
    await fetchJson(deleteUrl, { method: "DELETE" });
    setStatus("Item deleted successfully.");
    // reload lists depending on context
    if (selectedCountry) await handleSelectCountry(selectedCountry);
    else await handleLoadCountries();
  } catch (e) {
    setStatus("Delete failed: " + e.message);
    setIsError(true);
  }
}


  const renderOptions = (data) => {
    if (!data || data.length === 0) return <option value="">No options</option>;
    return data.map((item, idx) => {
      const value = item.code || item.id || item.name || String(idx);
      const label = item.name || JSON.stringify(item);
      return (
        <option key={idx} value={value}>
          {label}
        </option>
      );
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Frontend API Connector
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Dropdowns are populated from endpoints. Selecting a country loads its states via the country-provided link or fallback mapping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => handleLoadCountries()} disabled={loading}>
              Reload Countries
            </Button>
          </div>
        </header>

        <main className="bg-white dark:bg-slate-900 shadow-md rounded-lg p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Country</span>
              <select
                aria-label="Country"
                value={selectedCountry || ""}
                onChange={(e) => handleSelectCountry(e.target.value)}
                disabled={loading}
                className="mt-2 block w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select a country</option>
                {renderOptions(countries)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">State</span>
              <select
                aria-label="State"
                value={selectedState || ""}
                onChange={(e) => handleSelectState(e.target.value)}
                disabled={!states.length || loading}
                className="mt-2 block w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select a state</option>
                {renderOptions(states)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">City</span>
              <select
                aria-label="City"
                value={selectedCity || ""}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!cities.length || loading}
                className="mt-2 block w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select a city</option>
                {renderOptions(cities)}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Status:{" "}
              <span className={isError ? "text-red-500" : "text-emerald-600"}>{status}</span>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-200">
              <strong>Selected:</strong>{" "}
              <span className="ml-1">
                {selectedCountry || "-"} / {selectedState || "-"} / {selectedCity || "-"}
              </span>
            </div>
          </div>
        </main>

        <section className="bg-white dark:bg-slate-900 shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Selected Location</h2>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <div>Country: <span className="font-medium text-slate-800 dark:text-slate-100">{selectedCountry || "N/A"}</span></div>
            <div>State: <span className="font-medium text-slate-800 dark:text-slate-100">{selectedState || "N/A"}</span></div>
            <div>City: <span className="font-medium text-slate-800 dark:text-slate-100">{selectedCity || "N/A"}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
