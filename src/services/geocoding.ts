// Coordinate hardcoded per le città principali italiane (manteniamo come fallback)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Milano': { lat: 45.4642, lng: 9.1900 },
  'Roma': { lat: 41.9028, lng: 12.4964 },
  'Napoli': { lat: 40.8518, lng: 14.2681 },
  'Torino': { lat: 45.0703, lng: 7.6869 },
  'Bologna': { lat: 44.4949, lng: 11.3426 },
  'Firenze': { lat: 43.7696, lng: 11.2558 },
  'Catania': { lat: 37.5079, lng: 15.0830 },
  'Ragusa': { lat: 36.9269, lng: 14.7255 },
  'Genova': { lat: 44.4056, lng: 8.9463 }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoordinates = async (address: string, city: string, zipCode: string, country: string) => {
  try {
    const formattedAddress = encodeURIComponent(
      `${address}, ${zipCode} ${city}, ${country}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    );

    const proxyUrl = 'https://corsproxy.io/?';
    const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
    
    const searchUrl = `${proxyUrl}${nominatimUrl}?` + new URLSearchParams({
      q: formattedAddress,
      format: 'json',
      addressdetails: '1',
      limit: '1',
      'accept-language': 'en'
    }).toString();

    await delay(1000);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'GlobalSocialMap/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    // Fallback alle coordinate della città se disponibili
    const normalizedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
    if (CITY_COORDINATES[normalizedCity]) {
      const variation = 0.001;
      const coords = CITY_COORDINATES[normalizedCity];
      return {
        lat: coords.lat + (Math.random() - 0.5) * variation,
        lng: coords.lng + (Math.random() - 0.5) * variation
      };
    }

    throw new Error(`Address not found: ${address}, ${city}, ${country}`);
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}; 