import { useState, useEffect, useMemo } from "react";
import { Button } from "../components/button";
import countriesData from "../data/countries.json";
import statesByCountry from "../data/states_by_country.json";
import citiesByState from "../data/cities_by_state.json";

export default function LoadScript() {
  const [status, setStatus] = useState("Ready.");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [searchText, setSearchText] = useState(""); 
  const [minPopulation, setMinPopulation] = useState("");
  const [maxPopulation, setMaxPopulation] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const displayedCountries = useMemo(() => {
    const q = String(searchText || "").trim().toLowerCase();
    let list = (countries || []).slice();

    if (q) list = list.filter((c) => (c.name || "").toLowerCase().includes(q));

    const min = Number(minPopulation) || null;
    const max = Number(maxPopulation) || null;
    if (min) list = list.filter((c) => Number(c.population || 0) >= min);
    if (max) list = list.filter((c) => Number(c.population || 0) <= max);

    switch (sortOption) {
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "pop-asc":
        list.sort((a, b) => Number(a.population || 0) - Number(b.population || 0));
        break;
      case "pop-desc":
        list.sort((a, b) => Number(b.population || 0) - Number(a.population || 0));
        break;
      default:
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [countries, searchText, minPopulation, maxPopulation, sortOption]);

  useEffect(() => {
    // load countries from local JSON
    setLoading(true);
    try {
      setCountries(Array.isArray(countriesData) ? countriesData : []);
      setStatus("Countries loaded (local)");
    } catch (err) {
      setStatus("Failed to load local countries");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

// ...existing code...
/* helper: robust fetch that returns parsed JSON or throws */
async function fetchJson(url, init = {}) {
  if (!url) throw new Error("No URL provided to fetchJson");
  // allow absolute or relative URLs
  const full = /^https?:\/\//i.test(url) ? url : url.startsWith("/") ? url : `/${url}`;
  const res = await fetch(full, init);
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${txt}`);
  }
  const ct = res.headers.get?.("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

/* improved country selection: follow HATEOAS link when available, else local mapping */
async function handleSelectCountry(value) {
  setSelectedCountry(value);
  setStates([]);
  setCities([]);
  setSelectedState(null);
  setSelectedCity(null);
  setStatus("Loading states...");
  setIsError(false);

  try {
    const country = countries.find((c) => (c.code || c.id || c.name) === value);

    //Try HATEOAS link first
    let statesData = [];
    const statesLink = country && country._links && country._links.states && country._links.states.href;
    if (statesLink) {
      try {
        const payload = await fetchJson(statesLink);
        // payload may be array or { data: [...] }
        statesData = Array.isArray(payload) ? payload : payload.data || payload.items || [];
      } catch (err) {
        console.warn("[LoadScript] failing to fetch states via link, falling back:", err.message);
      }
    }

    // Fallback to local mapping if needed
    if (!statesData.length) {
      const candidates = [value, country && country.name, country && country.code, country && country.id]
        .filter(Boolean)
        .map(String);
      for (const k of candidates) {
        if (statesByCountry[k]) {
          statesData = statesByCountry[k];
          break;
        }
      }
      if (!statesData.length) {
        const key = Object.keys(statesByCountry).find((k) => k.toLowerCase() === String(value).toLowerCase());
        if (key) statesData = statesByCountry[key];
      }
      if (!statesData.length && country && country.name) {
        const key = Object.keys(statesByCountry).find(
          (k) =>
            k.toLowerCase().includes(String(country.name).toLowerCase()) ||
            String(country.name).toLowerCase().includes(k.toLowerCase())
        );
        if (key) statesData = statesByCountry[key];
      }
    }

    setStates(statesData || []);
    setStatus(statesData && statesData.length ? "States loaded" : "No states found");
  } catch (e) {
    setStatus("Error loading states: " + (e && e.message));
    setIsError(true);
  }
}

async function handleSelectState(value) {
  setSelectedState(value);
  setCities([]);
  setSelectedCity(null);
  setStatus("Loading cities...");
  setIsError(false);

  try {
    const stateObj = states.find((s) => (s.code || s.id || s.name) === value);

    // Try HATEOAS link first
    let citiesData = [];
    const citiesLink = stateObj && stateObj._links && stateObj._links.cities && stateObj._links.cities.href;
    if (citiesLink) {
      try {
        const payload = await fetchJson(citiesLink);
        citiesData = Array.isArray(payload) ? payload : payload.data || payload.items || [];
      } catch (err) {
        console.warn("[LoadScript] failing to fetch cities via link, falling back:", err.message);
      }
    }

    // Fallback to local mapping if needed
    if (!citiesData.length) {
      const candidates = [value, stateObj && stateObj.name].filter(Boolean).map(String);
      for (const k of candidates) {
        if (citiesByState[k]) {
          citiesData = citiesByState[k];
          break;
        }
      }
      if (!citiesData.length) {
        const key = Object.keys(citiesByState).find((k) => k.toLowerCase() === String(value).toLowerCase());
        if (key) citiesData = citiesByState[key];
      }
      if (!citiesData.length && stateObj && stateObj.name) {
        const key = Object.keys(citiesByState).find(
          (k) =>
            k.toLowerCase().includes(String(stateObj.name).toLowerCase()) ||
            String(stateObj.name).toLowerCase().includes(k.toLowerCase())
        );
        if (key) citiesData = citiesByState[key];
      }
    }

    setCities(citiesData || []);
    setStatus(citiesData && citiesData.length ? "Cities loaded" : "No cities found");
  } catch (e) {
    setStatus("Error loading cities: " + (e && e.message));
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
      <div className="max-w-6xl mx-auto">
        {/* Search / filter */}
        <div className="mb-4">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              aria-label="Search countries"
              placeholder="Search countries..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", flex: 1 }}
            />
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: 8 }}>
              <option value="name-asc">Name ↑</option>
              <option value="name-desc">Name ↓</option>
              <option value="pop-asc">Population ↑</option>
              <option value="pop-desc">Population ↓</option>
            </select>
            <input
              type="number"
              placeholder="Min pop"
              value={minPopulation}
              onChange={(e) => setMinPopulation(e.target.value)}
              style={{ width: 110, padding: 8 }}
            />
            <input
              type="number"
              placeholder="Max pop"
              value={maxPopulation}
              onChange={(e) => setMaxPopulation(e.target.value)}
              style={{ width: 110, padding: 8 }}
            />
          </div>
        </div>

        {/* Three-column layout: Countries | States | Cities */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {/* Countries */}
          <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: 10, borderBottom: "1px solid #f3f3f3", fontWeight: 600 }}>Countries</div>
            <div style={{ maxHeight: 420, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                    <th style={{ textAlign: "right", padding: 8 }}>Population</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCountries.map((c, idx) => {
                    const val = c.code || c.id || c.name;
                    const isActive = selectedCountry === val;
                    return (
                      <tr
                        key={idx}
                        onClick={() => {
                          setSelectedCountry(val);
                          handleSelectCountry(val);
                        }}
                        style={{
                          cursor: "pointer",
                          background: isActive ? "#eef6ff" : "transparent",
                        }}
                      >
                        <td style={{ padding: 8 }}>{c.name}</td>
                        <td style={{ padding: 8, textAlign: "right" }}>{Number(c.population || 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* States */}
          <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: 10, borderBottom: "1px solid #f3f3f3", fontWeight: 600 }}>
              States {selectedCountry ? `for ${selectedCountry}` : ""}
            </div>
            <div style={{ maxHeight: 420, overflow: "auto", padding: 8 }}>
              {states && states.length ? (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {states.map((s, i) => {
                    const val = s.code || s.id || s.name;
                    const isActive = selectedState === val;
                    return (
                      <li
                        key={i}
                        onClick={() => {
                          setSelectedState(val);
                          handleSelectState(val);
                        }}
                        style={{
                          cursor: "pointer",
                          padding: "8px 10px",
                          borderRadius: 6,
                          marginBottom: 6,
                          background: isActive ? "#eef6ff" : "#fff",
                          border: "1px solid #f3f3f3",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{s.name}</span>
                          <small style={{ color: "#666" }}>{s.population ? Number(s.population).toLocaleString() : ""}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div style={{ color: "#666" , padding: 10}}>No states to display</div>
              )}
            </div>
          </div>

          {/* Cities */}
          <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: 10, borderBottom: "1px solid #f3f3f3", fontWeight: 600 }}>
              Cities {selectedState ? `in ${selectedState}` : ""}
            </div>
            <div style={{ maxHeight: 420, overflow: "auto", padding: 8 }}>
              {cities && cities.length ? (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {cities.map((c, i) => (
                    <li
                      key={i}
                      onClick={() => setSelectedCity(c.name || (c.code || c.id || String(i)))}
                      style={{
                        cursor: "pointer",
                        padding: "8px 10px",
                        borderRadius: 6,
                        marginBottom: 6,
                        background: selectedCity === (c.name || c.code || c.id) ? "#eef6ff" : "#fff",
                        border: "1px solid #f3f3f3",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{c.name}</span>
                        <small style={{ color: "#666" }}>{c.population ? Number(c.population).toLocaleString() : ""}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: "#666", padding: 10 }}>No cities to display</div>
              )}
            </div>
          </div>
        </div>

        {/* status line */}
        <div style={{ marginTop: 12, color: isError ? "#C53030" : "#0f5132" }}>
          Status: {status}
        </div>
      </div>
    </div>
    );
  }