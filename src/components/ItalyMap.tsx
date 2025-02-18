import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  selectedRegion?: string;
  selectedProvince?: string;
  selectedCity?: string;
}

// Componente per gestire lo zoom
const ZoomHandler = ({ 
  organizations, 
  selectedRegion, 
  selectedProvince, 
  selectedCity 
}: {
  organizations: Organization[];
  selectedRegion?: string;
  selectedProvince?: string;
  selectedCity?: string;
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCity || selectedProvince || selectedRegion) {
      const filteredOrgs = organizations.filter(org => {
        if (selectedCity) return org.city === selectedCity;
        if (selectedProvince) return org.province === selectedProvince;
        if (selectedRegion) return org.region === selectedRegion;
        return true;
      });

      if (filteredOrgs.length > 0 && filteredOrgs[0].coordinates) {
        const bounds = L.latLngBounds(
          filteredOrgs
            .filter(org => org.coordinates)
            .map(org => [org.coordinates!.lat, org.coordinates!.lng])
        );
        
        // Aggiungi l'animazione di zoom
        map.flyToBounds(bounds, {
          padding: [50, 50],
          duration: 1, // durata dell'animazione in secondi
          easeLinearity: 0.5
        });
      }
    } else {
      // Reset alla vista dell'Italia con animazione
      map.flyTo([41.9028, 12.4964], 6, {
        duration: 1,
        easeLinearity: 0.5
      });
    }
  }, [map, selectedRegion, selectedProvince, selectedCity, organizations]);

  return null;
};

const ItalyMap: React.FC<ItalyMapProps> = ({ 
  organizations,
  selectedRegion,
  selectedProvince,
  selectedCity
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgsWithCoordinates, setOrgsWithCoordinates] = useState<OrganizationWithCoordinates[]>([]);

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
      setIsLoading(false);
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
        <ZoomHandler 
          organizations={organizations}
          selectedRegion={selectedRegion}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
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