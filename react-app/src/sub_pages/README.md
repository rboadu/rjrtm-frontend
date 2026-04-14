# Sub Pages

This folder contains individual page components for the RJRTM application.

## Pages

### Team.jsx
Displays the team members with placeholder sections for headshots and their names.

**Team Members:**
- Rebecca Boadu
- Jaden Ritchie
- Riku Santa Cruz
- Terra Nagai
- Mikiyas Legesse

### LoadScript.jsx
Page for loading and managing location demo UI.

Features:
- Loads local JSON data: src/data/countries.json, states_by_country.json, cities_by_state.json.
- Client-side search, filter (min/max population), and sort (name / population).
- Three-column interactive UI: Countries | States | Cities.
  - Click a country to load its states (from local mapping).
  - Click a state to load its cities.
  - Click a city to mark it selected.
- No external API calls in the simplified demo version.

### Assets
- Place favicons and static assets in: react-app/public/
  - Example: public/favicon-globe.svg
- JSON data lives in: react-app/src/data/

## Development / Usage

1. Install dependencies (if not already):
   - cd react-app
   - npm install

2. Start dev server:
   - npm run dev

3. Editing data:
   - Update JSON files under react-app/src/data/.
   - After editing, restart Vite (stop/start dev server) for imports to refresh, or put files under react-app/public and fetch them at runtime.

4. Regenerating demo data:
   - Optional scripts live in react-app/scripts/ (if present). Run with node scripts/<name>.js

## Notes
- UI styling uses simple inline styles and Tailwind classes if available. Adjust CSS as needed.
- Keep country/state/city keys consistent between states_by_country.json and cities_by_state.json.
- If you want the app to fetch remote data again, restore the original fetch logic in LoadScript.jsx.