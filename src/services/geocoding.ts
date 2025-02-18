const coordinatesCache = new Map<string, {lat: number, lng: number}>();

export const getCoordinates = async (address: string, city: string, zipCode: string) => {
  const cacheKey = `${address}-${city}-${zipCode}`;
  
  // Check cache first
  if (coordinatesCache.has(cacheKey)) {
    return coordinatesCache.get(cacheKey);
  }

  try {
    const fullAddress = encodeURIComponent(`${address}, ${zipCode} ${city}, Italy`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${fullAddress}`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coordinates = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      
      // Cache the result
      coordinatesCache.set(cacheKey, coordinates);
      return coordinates;
    }
    
    console.error(`No coordinates found for address: ${fullAddress}`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}; 