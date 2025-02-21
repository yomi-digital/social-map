import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Organization } from '../types/Organization';
import L from 'leaflet';
import { getCoordinates } from '../services/geocoding';
import LoadingScreen from './LoadingScreen';

// Fix per le icone di Leaflet
const iconUrl = '/images/marker-icon.png';
const iconShadow = '/images/marker-shadow.png';

// Crea un'icona personalizzata con il colore #00ffff
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="marker-pin"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Fix per l'icona di default
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Cache per le coordinate già calcolate
const coordinatesCache = new Map<string, {lat: number, lng: number}>();

interface ItalyMapProps {
  organizations: Organization[];
}

const ItalyMap: React.FC<ItalyMapProps> = ({ organizations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgsWithCoordinates, setOrgsWithCoordinates] = useState<Organization[]>([]);

  // Memorizza i marker per evitare ri-rendering non necessari
  const markers = useMemo(() => 
    orgsWithCoordinates.map(org => {
      if (!org.coordinates) return null;
      return (
        <Marker
          key={org.id}
          position={[org.coordinates.lat, org.coordinates.lng]}
          icon={customIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold">{org.name}</h3>
              <p>{org.address}</p>
              <p>{org.city}</p>
            </div>
          </Popup>
        </Marker>
      );
    }).filter(Boolean),
    [orgsWithCoordinates]
  );

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        console.log('Fetching coordinates for organizations:', organizations);
        
        const orgsWithCoords = await Promise.all(
          organizations.map(async (org) => {
            if (org.coordinates) {
              console.log('Using existing coordinates for:', org.name);
              return org;
            }

            // Usa la cache se disponibile
            const cacheKey = `${org.address}-${org.city}`;
            if (coordinatesCache.has(cacheKey)) {
              console.log('Using cached coordinates for:', org.name);
              return {
                ...org,
                coordinates: coordinatesCache.get(cacheKey)
              };
            }

            // Altrimenti ottieni nuove coordinate
            console.log('Fetching coordinates for:', org.name);
            const coords = await getCoordinates(org.address, org.city, org.zipCode);
            if (coords) {
              console.log('Got coordinates for:', org.name, coords);
              coordinatesCache.set(cacheKey, coords);
              return {
                ...org,
                coordinates: coords
              };
            }
            console.log('No coordinates found for:', org.name);
            return org;
          })
        );

        console.log('Organizations with valid coordinates:', orgsWithCoords.length);
        setOrgsWithCoordinates(orgsWithCoords);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching coordinates:', err);
        setError(err instanceof Error ? err.message : 'Error fetching coordinates');
        setIsLoading(false);
      }
    };

    if (organizations.length > 0) {
      fetchCoordinates();
    }
  }, [organizations]);

  const handleLoadingComplete = React.useCallback(() => {
    setIsMapReady(true);
  }, []);

  if (!isMapReady) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
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
        preferCanvas={true}
        className={`h-full w-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
        >
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default React.memo(ItalyMap); 