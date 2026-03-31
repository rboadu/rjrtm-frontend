const fs = require("fs");
const path = require("path");

async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
// There is hard coded data from the json file but improvements will be made when connecting it to a database
async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function main() {
  const root = path.resolve(__dirname, "../src/data");
  const countriesPath = path.join(root, "countries.json");
  const outStates = path.join(root, "states_by_country.json");
  const outCities = path.join(root, "cities_by_state.json");

  if (!fs.existsSync(countriesPath)) {
    console.error("countries.json not found at", countriesPath);
    process.exit(1);
  }

  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));
  const statesByCountry = {};
  const citiesByState = {};

  for (const c of countries) {
    const countryName = c.name;
    console.log("Processing:", countryName);

    // rate-limit a bit
    await sleep(300);

    // fetch states
    let states = [];
    try {
      const r = await postJson("https://countriesnow.space/api/v0.1/countries/states", { country: countryName });
      if (r && r.data && Array.isArray(r.data.states) && r.data.states.length) {
        // r.data.states might be objects or strings
        states = r.data.states.map(s => (typeof s === "string" ? { name: s } : { name: s.name || s.state || String(s) }));
      }
    } catch (err) {
      console.warn("states fetch error for", countryName, err.message || err);
    }

    // fallback placeholder if no states
    if (!states.length) {
      const placeholder = { name: `${countryName} State` };
      states = [placeholder];
    }

    statesByCountry[countryName] = states;

    // for each state fetch cities
    for (const s of states) {
      const stateName = s.name;
      // small delay to be polite
      await sleep(200);
      try {
        const r2 = await postJson("https://countriesnow.space/api/v0.1/countries/state/cities", { country: countryName, state: stateName });
        let cities = [];
        if (r2 && r2.data && Array.isArray(r2.data) && r2.data.length) {
          cities = r2.data.map(name => ({ name }));
        }
        if (!cities.length) {
          // fallback placeholder city
          cities = [{ name: `${stateName} City` }];
        }
        citiesByState[stateName] = cities;
      } catch (err) {
        console.warn("cities fetch error for", countryName, "/", stateName, err.message || err);
        citiesByState[stateName] = [{ name: `${stateName} City` }];
      }
    }
  }

  // write files
  fs.writeFileSync(outStates, JSON.stringify(statesByCountry, null, 2), "utf8");
  fs.writeFileSync(outCities, JSON.stringify(citiesByState, null, 2), "utf8");
  console.log("Wrote:", outStates, outCities);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});