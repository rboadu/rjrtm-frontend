import { useState } from "react";
import { Button } from "../components/button";

export default function LoadScript() {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://127.0.0.1:8000");
  const [status, setStatus] = useState("Ready.");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  async function fetchJson(base, path) {
    const url = base.replace(/\/+$/, "") + path;
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }
      return res.json();
    } catch (e) {
      throw e;
    }
  }

  const handleLoadData = async () => {
    setStatus("Loading...");
    setIsError(false);
    setLoading(true);
    setCountries([]);
    setStates([]);
    setCities([]);
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
      setStatus("Error loading data: " + e.message, true);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderList = (data) => {
    if (!data || data.length === 0) {
      return <li>No data found.</li>;
    }
    return data.map((item, idx) => (
      <li key={idx}>{item && item.name ? item.name : JSON.stringify(item)}</li>
    ));
  };

  return (
    <>
      <section className="card">
        <h1>Frontend API Connector</h1>
        <p>
          Enter your backend base URL and load 3 endpoints:
          <code>/countries</code>, <code>/states</code>, <code>/cities</code>.
        </p>
        <div className="row">
          <input
            type="url"
            placeholder="http://127.0.0.1:5005"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleLoadData} disabled={loading}>
            {loading ? "Loading..." : "Load Data"}
          </Button>
        </div>
        <p className={`status${isError ? " error" : ""}`}>{status}</p>
      </section>
      <section className="card">
        <h2>Countries</h2>
        <ul>{renderList(countries)}</ul>
      </section>
      <section className="card">
        <h2>States</h2>
        <ul>{renderList(states)}</ul>
      </section>
      <section className="card">
        <h2>Cities</h2>
        <ul>{renderList(cities)}</ul>
      </section>
    </>
  );
}