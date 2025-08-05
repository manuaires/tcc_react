import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export default function MapComponent() {
  const position = [-23.8077, -47.7222]; // São Paulo

  return (
    <MapContainer center={position} zoom={13} style={{ height: '200px', width: '25%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Estamos aqui! 📍
        </Popup>
      </Marker>
    </MapContainer>
  );
}



