// WorldMap.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from "react-leaflet";
import L from "leaflet";

const countryStyle = {
  color: '#888',
  weight: 1,
  fillColor: '#eae6df',
  fillOpacity: 1,
};

// Fix for default marker icon in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function WorldMap({ onLocationSelect, selectedPosition, countriesGeoJson }) {

  // Define the world bounds (southwest and northeast corners)
  const worldBounds = [
    [-85, -180], // Southwest corner (min lat, min lng)
    [85, 180],   // Northeast corner (max lat, max lng)
  ];

  function MapClickHandler() {
    useMapEvents({
      dblclick: (e) => {
        if (onLocationSelect) {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      doubleClickZoom={false}
      style={{ height: "500px", width: "100%", fillColor: 'transparent', weight: 2, color: '#666' }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0} // Prevents dragging outside bounds
    >
      {/* ...existing code... */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {countriesGeoJson && (
        <GeoJSON data={countriesGeoJson} style={countryStyle} />
      )}
      <MapClickHandler />
      {selectedPosition && (
        <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>Your Selection</strong>
              <br />
              Lat: {selectedPosition.lat.toFixed(4)}°
              <br />
              Lng: {selectedPosition.lng.toFixed(4)}°
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default WorldMap;