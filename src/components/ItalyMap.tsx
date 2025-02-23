import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Organization } from '../types/Organization';
import L from 'leaflet';
import { getCoordinates } from '../services/geocoding';
import LoadingScreen from './LoadingScreen';
import Filters from './Filters';
import { normalizeCountryName } from '../utils/countryNormalization';

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

// Funzione di utilità per normalizzare il testo
const normalizeText = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Componente per gestire il bounds della mappa
const MapBounds: React.FC<{ organizations: Organization[] }> = ({ organizations }) => {
  const map = useMap();

  useEffect(() => {
    if (organizations.length === 0) return;

    // Raccogli tutte le coordinate valide
    const validCoords = organizations
      .filter(org => org.coordinates)
      .map(org => [org.coordinates.lat, org.coordinates.lng]);

    if (validCoords.length === 0) return;

    // Crea un bounds che include tutte le coordinate
    const bounds = L.latLngBounds(validCoords);
    
    // Aggiungi un padding per una migliore visualizzazione
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 6 // Limita lo zoom massimo
    });
  }, [organizations, map]);

  return null;
};

const ItalyMap: React.FC<ItalyMapProps> = ({ organizations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgsWithCoordinates, setOrgsWithCoordinates] = useState<Organization[]>([]);
  const [filters, setFilters] = useState({
    countries: [] as string[],
    regions: [] as string[],
    sectors: [] as string[]
  });

  // Filtra le organizzazioni in base ai filtri selezionati
  const filteredOrganizations = useMemo(() => {
    return orgsWithCoordinates.filter(org => {
      if (!org) return false;
      
      const normalizedOrgCountry = normalizeCountryName(org.country || '');
      
      const matchesCountry = filters.countries.length === 0 || 
        filters.countries.includes(normalizedOrgCountry);
      
      const matchesRegion = filters.regions.length === 0 || 
        (org.region && filters.regions.includes(org.region));
      
      const matchesSector = filters.sectors.length === 0 || 
        (org.sector && filters.sectors.includes(org.sector));

      return matchesCountry && matchesRegion && matchesSector;
    });
  }, [orgsWithCoordinates, filters]);

  // Aggiorna i markers per usare le organizzazioni filtrate
  const markers = useMemo(() => 
    filteredOrganizations.map((org, index) => {
      if (!org.coordinates) return null;
      // Usa una combinazione di id e index per assicurare chiavi uniche
      const uniqueKey = `${org.id}-${index}`;
      return (
        <Marker
          key={uniqueKey}
          position={[org.coordinates.lat, org.coordinates.lng]}
          icon={customIcon}
        >
          <Popup>
            <div className="min-w-[300px] p-2">
              <h3 className="text-xl font-bold mb-2">{normalizeText(org.name)}</h3>
              
              <div className="space-y-2 text-sm">
                {/* Indirizzo completo */}
                <p className="font-medium">
                  {normalizeText(org.address)}<br />
                  {org.zipCode} {normalizeText(org.city)} ({normalizeText(org.province)})<br />
                  {normalizeText(org.region)}
                </p>

                {/* Settore */}
                <p>
                  <span className="font-medium">Settore:</span> {org.sector}
                </p>

                {/* Contatti */}
                <div className="space-y-1">
                  {org.website && (
                    <p>
                      <span className="font-medium">Website:</span>{' '}
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {org.website.toLowerCase()}
                      </a>
                    </p>
                  )}
                  
                  {org.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a 
                        href={`mailto:${org.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {org.email.toLowerCase()}
                      </a>
                    </p>
                  )}
                  
                  {org.phone && (
                    <p>
                      <span className="font-medium">Telefono:</span>{' '}
                      <a 
                        href={`tel:${org.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {org.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    }).filter(Boolean),
    [filteredOrganizations]
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
            const coords = await getCoordinates(
              org.address, 
              org.city, 
              org.zipCode,
              normalizeCountryName(org.country)
            );
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
    <div className="h-full w-full relative">
      <Filters 
        organizations={orgsWithCoordinates}
        onFiltersChange={setFilters}
      />
      <MapContainer
        center={[48.8566, 2.3522]} // Centro Europa come default
        zoom={4} // Zoom iniziale più ampio
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
        <MapBounds organizations={filteredOrganizations} />
      </MapContainer>
    </div>
  );
};

export default React.memo(ItalyMap); 