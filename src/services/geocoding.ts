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
    throw new Error(`No coordinates found for address: ${fullAddress}`);
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}; 