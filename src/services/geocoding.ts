// Funzione di utilità per aggiungere un delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache per le coordinate
const coordinatesCache: Record<string, { lat: number; lng: number }> = {};

export const getCoordinates = async (address: string, city: string, zipCode: string) => {
  try {
    const fullAddress = encodeURIComponent(`${address}, ${zipCode} ${city}, Italy`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${fullAddress}`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    // Se non trova l'indirizzo completo, prova solo con la città
    const cityResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}, Italy`
    );
    
    const cityData = await cityResponse.json();
    
    if (cityData && cityData.length > 0) {
      return {
        lat: parseFloat(cityData[0].lat),
        lng: parseFloat(cityData[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}; 