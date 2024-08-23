import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ address, position }) => {
  const defaultPosition = [0, 0];
  const markerPosition = position.length > 1 ? position : defaultPosition;

  return (
    <MapContainer
      center={markerPosition}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {address && (
        <Marker position={markerPosition}>
          <Popup>{address}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
