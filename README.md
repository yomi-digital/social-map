# Italian Innovation Map

An interactive map showing the distribution of innovation spaces, coworking, and educational initiatives across Italy.

## Features
- Interactive map visualization
- Automatic marker clustering for dense areas
- Multi-sector organization support
- Advanced filtering by region, province, city, and sectors
- Detailed information popups
- Visual filtering for better map readability
- Automatic geocoding from addresses
- Support for Italian location names

## How to Add an Organization

To add a new organization, use the "Add Your Space" button or modify the `src/data/organizations.json` file. Each organization must follow this format:

```json
{
  "id": "13",                        // Unique identifier
  "name": "Spazio Innovazione",      // Name (can be in Italian)
  "city": "Milano",                  // City name (in Italian)
  "region": "Lombardia",             // Region name (in Italian)
  "province": "Milano",              // Province name (in Italian)
  "address": "Via Esempio 123",      // Full address
  "zipCode": "20123",               // ZIP code (5 digits)
  "sectors": [                      // Array of sectors
    "Coworking",
    "Events",
    "Education"
  ],
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
- `Local Projects`
- `Inner Development`
- `Education`
- `Urban Garden`
- `Open To Residences`
- `Other`

Organizations can belong to multiple sectors.

### Filtering
The map supports filtering by:
- Region
- Province
- City
- Multiple sectors

### Location Data
- All location data (city, region, province) can be written in Italian
- Addresses are automatically geocoded to coordinates
- No need to manually find or input coordinates
- The system will handle the conversion to map coordinates

## Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Environment Variables

Create a `.env.local` file:
```
VITE_GITHUB_TOKEN=your_token_here
```

## Technologies Used
- React 18
- TypeScript
- Leaflet (for mapping)
- Tailwind CSS (for styling)
- Vite (build tool)
- OpenStreetMap Geocoding

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

## Setup

```bash
# Install
yarn install

# Development
yarn dev

# Build
yarn build
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
