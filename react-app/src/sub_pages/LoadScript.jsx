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
  
  // Clear/reset handler: resets filters, selections and UI state
  const handleClear = () => {
    setSearchText("");
    setMinPopulation("");
    setMaxPopulation("");
    setSortOption("name-asc");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setStates([]);
    setCities([]);
    setStatus("Ready.");
    setIsError(false);
  };

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

  const inputCls = "px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Search / filter */}
        <div className="mb-4 flex gap-2 items-center">
          <input
            aria-label="Search countries"
            placeholder="Search countries..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`${inputCls} flex-1`}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={inputCls}
          >
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
            className={`${inputCls} w-28`}
          />
          <input
            type="number"
            placeholder="Max pop"
            value={maxPopulation}
            onChange={(e) => setMaxPopulation(e.target.value)}
            className={`${inputCls} w-28`}
          />
          <button
            onClick={handleClear}
            aria-label="Clear filters"
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Three-column layout: Countries | States | Cities */}
        <div className="grid grid-cols-3 gap-3">
          {/* Countries */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 font-semibold text-gray-900 dark:text-gray-100">
              Countries
            </div>
            <div className="max-h-[420px] overflow-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading countries...</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700">
                      <th className="text-left px-2 py-2 text-gray-700 dark:text-gray-300">Name</th>
                      <th className="text-right px-2 py-2 text-gray-700 dark:text-gray-300">Population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCountries.map((c, idx) => {
                      const val = c.code || c.id || c.name;
                      const isActive = selectedCountry === val;
                      return (
                        <tr
                          key={idx}
                          onClick={() => { setSelectedCountry(val); handleSelectCountry(val); }}
                          className={`cursor-pointer ${isActive ? "bg-blue-50 dark:bg-blue-900/40" : "hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                        >
                          <td className="px-2 py-2 text-gray-900 dark:text-gray-100">{c.name}</td>
                          <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-400">{Number(c.population || 0).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* States */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 font-semibold text-gray-900 dark:text-gray-100">
              States {selectedCountry ? `for ${selectedCountry}` : ""}
            </div>
            <div className="max-h-[420px] overflow-auto p-2">
              {states && states.length ? (
                <ul className="space-y-1.5">
                  {states.map((s, i) => {
                    const val = s.code || s.id || s.name;
                    const isActive = selectedState === val;
                    return (
                      <li
                        key={i}
                        onClick={() => { setSelectedState(val); handleSelectState(val); }}
                        className={`cursor-pointer px-3 py-2 rounded-md border ${isActive ? "bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700" : "bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-900 dark:text-gray-100">{s.name}</span>
                          <small className="text-gray-500 dark:text-gray-400">{s.population ? Number(s.population).toLocaleString() : ""}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-2 text-gray-500 dark:text-gray-400">No states to display</div>
              )}
            </div>
          </div>

          {/* Cities */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 font-semibold text-gray-900 dark:text-gray-100">
              Cities {selectedState ? `in ${selectedState}` : ""}
            </div>
            <div className="max-h-[420px] overflow-auto p-2">
              {cities && cities.length ? (
                <ul className="space-y-1.5">
                  {cities.map((c, i) => {
                    const val = c.name || c.code || c.id;
                    const isActive = selectedCity === val;
                    return (
                      <li
                        key={i}
                        onClick={() => setSelectedCity(val || String(i))}
                        className={`cursor-pointer px-3 py-2 rounded-md border ${isActive ? "bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700" : "bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-900 dark:text-gray-100">{c.name}</span>
                          <small className="text-gray-500 dark:text-gray-400">{c.population ? Number(c.population).toLocaleString() : ""}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-2 text-gray-500 dark:text-gray-400">No cities to display</div>
              )}
            </div>
          </div>
        </div>

        {/* status line */}
        <div className={`mt-3 text-sm ${isError ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
          Status: {status}
        </div>
      </div>
    </div>
  );
}