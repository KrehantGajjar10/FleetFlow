// src/components/TripMap/TripMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './TripMap.css';

// Fix for default Leaflet marker icons not showing up in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const TripMap = ({ trips }) => {
  // Center map on Western India (since you used Mumbai & Pune in your tests)
  const defaultCenter = [19.0760, 72.8777]; // Mumbai Coordinates

  // In a real app, you would use a "Geocoder" API to turn city names into exact Lat/Lng coordinates.
  // For our demo, we will use a small lookup dictionary for common cities.
  const cityCoordinates = {
    "Mumbai": [19.0760, 72.8777],
    "Pune": [18.5204, 73.8567],
    "Ahmedabad": [23.0225, 72.5714],
    "Delhi": [28.7041, 77.1025],
    "Surat": [21.1702, 72.8311],
    "Bangalore": [12.9716, 77.5946]
  };

  return (
    <div className="map-container">
      <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={false}>
        {/* The TileLayer is the actual visual map (using OpenStreetMap for free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Loop through all trips and drop a pin on their Destination! */}
        {trips.map((trip) => {
          // Try to find the coordinate for the destination, fallback to Mumbai if unknown
          const position = cityCoordinates[trip.destination] || defaultCenter;
          
          return (
            <Marker key={trip.id} position={position}>
              <Popup>
                <strong>Trip #{trip.id}</strong> <br/>
                From: {trip.origin} <br/>
                To: {trip.destination} <br/>
                Status: {trip.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TripMap;
