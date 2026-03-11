import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/button";
import { API_BASE } from "../config";

export default function LoadScript() {
  const [apiBaseUrl, setApiBaseUrl] = useState(
    API_BASE || "http://127.0.0.1:9000",
  );
  const [status, setStatus] = useState("Ready.");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [entity, setEntity] = useState("countries");

  async function fetchJson(base, path) {
    const url = base.replace(/\/+$/, "") + path;
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
  }

  const handleLoadData = useCallback(async () => {
    setStatus("Loading...");
    setIsError(false);
    setLoading(true);
    setCountries([]);
    setStates([]);
    setCities([]);
    console.log("handleLoadData: starting", { apiBaseUrl });

    try {
      const [countriesData, statesData, citiesData] = await Promise.all([
        fetchJson(apiBaseUrl, "/countries/"),
        fetchJson(apiBaseUrl, "/states"),
        fetchJson(apiBaseUrl, "/cities"),
      ]);

      setCountries(countriesData);
      setStates(statesData);
      setCities(citiesData);
      setStatus("Data loaded successfully!");
    } catch (e) {
      setStatus("Error loading data: " + e.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  // Auto-load once on mount
  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const getCurrentData = () => {
    if (entity === "countries") return countries;
    if (entity === "states") return states;
    if (entity === "cities") return cities;
    return [];
  };

  async function deleteItem(item) {
    let path = "";
    if (entity === "countries") path = `/countries/${item.name}`;
    if (entity === "states") path = `/states/${item.code}`;
    if (entity === "cities") path = `/cities/${item._id}`;

    try {
      await fetch(apiBaseUrl.replace(/\/+$/, "") + path, { method: "DELETE" });
      setStatus("Item deleted successfully.");
      handleLoadData();
    } catch (e) {
      setStatus("Delete failed: " + e.message);
      setIsError(true);
    }
  }

  const renderList = (data) => {
    if (!data || data.length === 0) return <li>No data found.</li>;
    return data.map((item, idx) => (
      <li key={idx} className="flex justify-between items-center">
        <span>{item && item.name ? item.name : JSON.stringify(item)}</span>
        <Button onClick={() => deleteItem(item)}>Delete</Button>
      </li>
    ));
  };

  return (
    <div className="min-h-screen bg-[#232b36]">
      <section className="card">
        <h1>Frontend API Connector</h1>
        <p>This UI displays data from /countries, /states and /cities.</p>
        <p className={`status${isError ? " error" : ""}`}>{status}</p>
      </section>

      <div className="flex gap-4 justify-center my-6">
        {["countries", "states", "cities"].map((tab) => (
          <button
            key={tab}
            onClick={() => setEntity(tab)}
            className={`px-4 py-2 rounded-full capitalize ${
              entity === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="card">
        <h2 className="capitalize">{entity}</h2>
        <ul>{renderList(getCurrentData())}</ul>
      </section>
    </div>
  );
}
