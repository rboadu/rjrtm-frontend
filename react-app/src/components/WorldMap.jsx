import { MapContainer, TileLayer } from "react-leaflet";
import React from "react";
// export default function WorldMapPage() {
//   import React from "react";
//   import WorldMap from "../components/worldMap";

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>World Map</h1>
//       <WorldMap />
//     </div>
//   );
// }
function WorldMap() {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
    </MapContainer>
  );
}
export default WorldMap;