import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Organization } from '../types/Organization';
import L from 'leaflet';
import { getCoordinates } from '../services/geocoding';

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

interface OrganizationWithCoordinates extends Organization {
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ItalyMapProps {
  organizations: Organization[];
}

const ItalyMap: React.FC<ItalyMapProps> = ({ organizations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgsWithCoordinates, setOrgsWithCoordinates] = useState<OrganizationWithCoordinates[]>([]);

  useEffect(() => {
    if (organizations.length > 0) {
      setIsLoading(false);
    }
  }, [organizations]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const orgsWithCoords = await Promise.all(
        organizations.map(async (org) => {
          if (org.coordinates) {
            return org as OrganizationWithCoordinates;
          }

          const coords = await getCoordinates(org.address, org.city, org.zipCode);
          if (coords) {
            return {
              ...org,
              coordinates: coords
            } as OrganizationWithCoordinates;
          }
          return null;
        })
      );

      setOrgsWithCoordinates(orgsWithCoords.filter((org): org is OrganizationWithCoordinates => org !== null));
    };

    fetchCoordinates();
  }, [organizations]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Errore nel caricamento della mappa:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[41.9028, 12.4964]}
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
          {orgsWithCoordinates.map((org) => (
            <Marker
              key={org.id}
              position={[org.coordinates.lat, org.coordinates.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="min-w-[250px]">
                  <h3 className="font-bold text-lg mb-2">{org.name}</h3>
                  <p className="text-gray-700">{org.address}</p>
                  <p className="text-gray-700 mb-2">{org.zipCode} - {org.city} ({org.province})</p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Region:</span> {org.region}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Sector:</span> {org.sector}
                  </p>
                  {(org.website || org.email || org.phone) && (
                    <div className="border-t pt-2">
                      {org.website && (
                        <p className="text-sm">
                          <a href={org.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            Website
                          </a>
                        </p>
                      )}
                      {org.email && (
                        <p className="text-sm">
                          <a href={`mailto:${org.email}`} className="text-blue-600 hover:underline">
                            {org.email}
                          </a>
                        </p>
                      )}
                      {org.phone && (
                        <p className="text-sm">
                          <a href={`tel:${org.phone}`} className="text-blue-600 hover:underline">
                            {org.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
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