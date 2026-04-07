import { useEffect, useState } from "react";

export default function ExploreGeography() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/countries/")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

    return (
    <div className="p-8 text-white">
        <h1 className="text-3xl mb-6">Explore Geography</h1>

        {countries.length === 0 ? (
        <p className="text-gray-300">
            No countries in the database yet. Use the "Load Script" page to add some.
        </p>
        ) : (
        <ul className="space-y-3">
            {countries.map((country) => (
            <li key={country.name} className="bg-gray-800 p-3 rounded">
                {country.name}
            </li>
            ))}
        </ul>
        )}
    </div>
    );
}