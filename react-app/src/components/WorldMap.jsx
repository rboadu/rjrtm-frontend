// WorldMap.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import React, { useState } from "react";
import L from "leaflet";

// Fix for default marker icon in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function WorldMap({ onLocationSelect, selectedPosition }) {
  
  // Component to handle double-click events
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
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapClickHandler />
      
      {/* Show marker at selected position */}
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