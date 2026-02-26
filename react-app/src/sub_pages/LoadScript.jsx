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

  // NEW: which entity is currently selected
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


  const handleLoadData = async () => {

    setStatus("Loading...");
    setIsError(false);
    setLoading(true);

    setCountries([]);
    setStates([]);
    setCities([]);

    try {

      const [countriesData, statesData, citiesData] =
        await Promise.all([
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
  };


  // NEW: return data based on selected entity
  const getCurrentData = () => {
    if (entity === "countries") return countries;
    if (entity === "states") return states;
    if (entity === "cities") return cities;
  };


  // NEW: delete handler (backend handles cascade)
  async function deleteItem(item) {

    let path = "";

    if (entity === "countries") {
      path = `/countries/${item.name}`;
    }

    if (entity === "states") {
      path = `/states/${item.code}`;
    }

    if (entity === "cities") {
      path = `/cities/${item._id}`;
    }

    try {

      await fetch(apiBaseUrl.replace(/\/+$/, "") + path, {
        method: "DELETE",
      });

      setStatus("Item deleted successfully.");

      // reload data after deletion
      handleLoadData();

    } catch (e) {

      setStatus("Delete failed: " + e.message);
      setIsError(true);

    }
  }


  const renderList = (data) => {

    if (!data || data.length === 0) {
      return <li>No data found.</li>;
    }

    return data.map((item, idx) => (

      <li key={idx} className="flex justify-between items-center">

        <span>
          {item && item.name ? item.name : JSON.stringify(item)}
        </span>

        <Button onClick={() => deleteItem(item)}>
          Delete
        </Button>

      </li>
    ));
  };


  return (
    <>
      {/* API Connector */}
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

        <p className={`status${isError ? " error" : ""}`}>
          {status}
        </p>

      </section>


      {/* ENTITY TABS */}
      <div className="flex gap-4 justify-center my-6">

        {["countries", "states", "cities"].map((tab) => (

          <button
            key={tab}
            onClick={() => setEntity(tab)}
            className={`px-4 py-2 rounded-full capitalize
              ${entity === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
              }`}
          >
            {tab}
          </button>

        ))}

      </div>


      {/* ACTIVE ENTITY VIEW */}
      <section className="card">

        <h2 className="capitalize">{entity}</h2>

        <ul>
          {renderList(getCurrentData())}
        </ul>

      </section>

    </>
  );
}