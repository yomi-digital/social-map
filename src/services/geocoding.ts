// Coordinate hardcoded per le città principali italiane
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Milano': { lat: 45.4642, lng: 9.1900 },
  'Roma': { lat: 41.9028, lng: 12.4964 },
  'Napoli': { lat: 40.8518, lng: 14.2681 },
  'Torino': { lat: 45.0703, lng: 7.6869 },
  'Bologna': { lat: 44.4949, lng: 11.3426 },
  'Firenze': { lat: 43.7696, lng: 11.2558 },
  'Catania': { lat: 37.5079, lng: 15.0830 },
  'Ragusa': { lat: 36.9269, lng: 14.7255 },
  'Genova': { lat: 44.4056, lng: 8.9463 },
  'Venezia': { lat: 45.4371, lng: 12.3326 },
  'Palermo': { lat: 38.1157, lng: 13.3615 },
  'Trento': { lat: 46.0748, lng: 11.1217 }
};

// Funzione di utilità per aggiungere un delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoordinates = async (address: string, city: string, zipCode: string) => {
  try {
    // Formatta l'indirizzo in modo preciso
    const formattedAddress = encodeURIComponent(
      `${address}, ${zipCode} ${city}, Italia`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Rimuove gli accenti
    );

    // Usa un proxy CORS per evitare problemi di CORS
    const proxyUrl = 'https://corsproxy.io/?';
    const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
    
    // Costruisci l'URL con parametri più precisi
    const searchUrl = `${proxyUrl}${nominatimUrl}?` + new URLSearchParams({
      q: formattedAddress,
      format: 'json',
      addressdetails: '1',
      limit: '1',
      countrycodes: 'it',
      'accept-language': 'it'
    }).toString();

    // Aggiungi un delay per rispettare il rate limiting
    await delay(1000);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'SocialMapItaly/1.0 (https://socialmap.it)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      console.log('Geocoding result:', result);
      
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
    }

    throw new Error(`Indirizzo non trovato: ${address}, ${city}`);
  } catch (error) {
    console.error('Geocoding error:', error);
    
    // Se abbiamo le coordinate della città, usiamole come fallback
    const normalizedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
    if (CITY_COORDINATES[normalizedCity]) {
      console.warn('Using city coordinates as fallback for:', address);
      const variation = 0.001; // Circa 100m di variazione
      const coords = CITY_COORDINATES[normalizedCity];
      return {
        lat: coords.lat + (Math.random() - 0.5) * variation,
        lng: coords.lng + (Math.random() - 0.5) * variation
      };
    }

    throw new Error(`Non è stato possibile trovare le coordinate per: ${address}, ${city}`);
  }
}; 