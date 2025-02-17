import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Organization } from '../types/Organization';
import L from 'leaflet';

// Fix per le icone di Leaflet
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Crea un'icona personalizzata con il colore #00ffff
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #00ffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

interface ItalyMapProps {
  organizations: Organization[];
}

const ItalyMap = ({ organizations }: ItalyMapProps) => {
  const defaultPosition: [number, number] = [41.9028, 12.4964]; // Centro Italia (Roma)

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultPosition}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            return L.divIcon({
              html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
              className: 'custom-marker-cluster',
              iconSize: L.point(40, 40)
            });
          }}
        >
          {organizations.map((org) => (
            <Marker
              key={org.id}
              position={[org.coordinates.lat, org.coordinates.lng]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{org.name}</h3>
                  <p>{org.city}, {org.province}</p>
                  <p>Settore: {org.sector}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default ItalyMap; 