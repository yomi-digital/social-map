# Italian Innovation Map

An interactive map showing the distribution of innovation spaces, coworking, and educational initiatives across Italy.

## Features
- Interactive map visualization
- Automatic marker clustering for dense areas
- Detailed information popups
- Visual filtering for better map readability
- Automatic geocoding from addresses
- Support for Italian location names

## How to Add an Organization

To add a new organization, modify the `src/data/organizations.json` file. Each organization must follow this format:

```json
{
  "id": "13",                        // Unique identifier
  "name": "Spazio Innovazione",      // Name (can be in Italian)
  "city": "Milano",                  // City name (in Italian)
  "region": "Lombardia",             // Region name (in Italian)
  "province": "Milano",              // Province name (in Italian)
  "address": "Via Esempio 123",      // Full address
  "zipCode": "20123",               // ZIP code (5 digits)
  "sector": "Hackerspace",          // See available sectors below
  "website": "https://example.com",  // Optional
  "email": "info@example.com",      // Optional
  "phone": "+39 02 1234567"         // Optional, with international prefix
}
```

### Available Sectors
- `Hackerspace`
- `Coworking`
- `Fablab`
- `Events`
- `Permaculture`
- `Web3`
- `Local projects`
- `Inner development`
- `Education`

### Location Data
- All location data (city, region, province) can be written in Italian
- Addresses are automatically geocoded to coordinates
- No need to manually find or input coordinates
- The system will handle the conversion to map coordinates

### Practical Example
```json
{
  "id": "13",
  "name": "FabLab Torino",
  "city": "Torino",
  "region": "Piemonte",
  "province": "Torino",
  "address": "Via Egeo 16",
  "zipCode": "10134",
  "sector": "Fablab",
  "website": "https://fablabtorino.org",
  "email": "info@fablabtorino.org",
  "phone": "+39 011 1234567"
}
```

## Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Technologies Used
- React 18
- TypeScript
- Leaflet (for mapping)
- Tailwind CSS (for styling)
- Vite (build tool)
- OpenStreetMap Geocoding
- Node-geocoder

## Important Notes
- Ensure the ID is unique
- ZIP code must be in the correct format (5 digits)
- Location names can be in Italian
- All URLs should include `https://` or `http://`
- Phone numbers should include international prefix (+39 for Italy)
- Addresses are automatically converted to coordinates
- The system uses OpenStreetMap for geocoding (no API key needed)

# Social Map

Una mappa interattiva delle organizzazioni sociali in Italia.

## Setup Locale

```bash
# Installa le dipendenze
yarn install

# Avvia il server di sviluppo
yarn dev
```

## Variabili d'Ambiente

Crea un file `.env.local` con:

```
VITE_GITHUB_TOKEN=your_token_here
```

## Deployment

1. Configura le variabili d'ambiente su Vercel:
   - VITE_GITHUB_TOKEN

2. Collega il repository a Vercel

3. Deploy:
```bash
yarn build
vercel --prod
```
