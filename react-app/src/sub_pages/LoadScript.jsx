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
            <select
              aria-label="City"
              value={selectedCity || ""}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!cities.length || loading}
            >
              <option value="">Select a city</option>
              {renderOptions(cities)}
            </select>
          </label>
        </div>

        <ul>{/* list is optional; keep for backward compatibility */}</ul>

        <div style={{ marginTop: 12, textAlign: "left" }}>
          <strong>Selected:</strong>{" "}
          {selectedCountry || "-"} / {selectedState || "-"} / {selectedCity || "-"}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button onClick={() => handleLoadCountries()} disabled={loading}>
            Reload Countries
          </Button>
        </div>
      </section>

      <section className="card">
        <h2>Selected Location</h2>
        <p>
          Country: {selectedCountry || "N/A"}
          <br />
          State: {selectedState || "N/A"}
          <br />
          City: {selectedCity || "N/A"}
        </p>
      </section>
    </div>
  );
}