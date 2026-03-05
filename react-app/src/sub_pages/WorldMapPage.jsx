import WorldMap from "../components/worldMap";
import Rules from "../components/Rules";

function WorldMapPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>World Map</h1>
      <Rules />

      <WorldMap />
    </div>
  );
}

export default WorldMapPage;