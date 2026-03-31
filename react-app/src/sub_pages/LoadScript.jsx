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
      // fallback to local map keyed by country name
      statesData = statesByCountry[value] || [];
    }
    setStates(statesData || []);
    setStatus("States loaded");
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
    const state = states.find((s) => (s.code || s.id || s.name) === value);
    let citiesUrl = state && state._links && state._links.cities ? state._links.cities.href : null;

    let citiesData = [];
    if (citiesUrl) {
      citiesData = await fetchJson(citiesUrl);
    } else {
      citiesData = citiesByState[value] || [];
    }
    setCities(citiesData || []);
    setStatus("Cities loaded");
  } catch (e) {
    setStatus("Error loading cities: " + e.message);
    setIsError(true);
  }
}
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="card">
        <h1>Frontend API Connector</h1>
        <p>
          Dropdowns are populated from endpoints. Selecting a country loads its
          states via the country-provided link or fallback query.
        </p>
        <p className={`status${isError ? " error" : ""}`}>{status}</p>
      </section>

      <section className="card">
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <label>
            Country
            <select
              aria-label="Country"
              value={selectedCountry || ""}
              onChange={(e) => handleSelectCountry(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a country</option>
              {renderOptions(countries)}
            </select>
          </label>

          <label>
            State
            <select
              aria-label="State"
              value={selectedState || ""}
              onChange={(e) => handleSelectState(e.target.value)}
              disabled={!states.length || loading}
            >
              <option value="">Select a state</option>
              {renderOptions(states)}
            </select>
          </label>

          <label>
            City
            <select aria-label="City" value="" onChange={() => {}} disabled={!cities.length || loading}>
              <option value="">Select a city</option>
              {renderOptions(cities)}
            </select>
          </label>
        </div>

        <ul>{/* list is optional; keep for backward compatibility */}</ul>

        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => handleLoadCountries()} disabled={loading}>
            Reload Countries
          </Button>
        </div>
      </section>
    </div>
  );
}