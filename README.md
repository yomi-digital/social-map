# Italian Innovation Map

An interactive map showing the distribution of innovation spaces, coworking, and educational initiatives across Italy.

## Features
- Interactive map visualization
- Automatic marker clustering for dense areas
- Detailed information popups
- Visual filtering for better map readability

## How to Add an Organization

To add a new organization, modify the `src/data/organizations.json` file. Each organization must follow this format:

```json
{
  "id": "13",                        // Unique identifier
  "name": "Organization Name",       // Full name
  "city": "Milan",                  // City name in English
  "region": "Lombardy",             // Region name in English
  "province": "Milan",              // Province name in English
  "address": "Via Example 123",     // Full address
  "zipCode": "20123",              // ZIP code
  "sector": "Hackerspace",         // See available sectors
  "website": "https://example.com", // Optional
  "email": "info@example.com",     // Optional
  "phone": "+39 02 1234567",       // Optional
  "coordinates": {
    "lat": 45.4642,                // Latitude
    "lng": 9.1900                  // Longitude
  }
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

### How to Find Coordinates
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for the organization's address
3. Right-click on the exact location
4. Select "What's here?"
5. The coordinates will appear at the bottom (latitude, longitude)

### Practical Example
```json
{
  "id": "13",
  "name": "Milan Hackerspace",
  "city": "Milan",
  "region": "Lombardy",
  "province": "Milan",
  "address": "Via Innovation 42",
  "zipCode": "20123",
  "sector": "Hackerspace",
  "website": "https://hackerspace.example.com",
  "email": "info@hackerspace.example.com",
  "phone": "+39 02 1234567",
  "coordinates": {
    "lat": 45.4642,
    "lng": 9.1900
  }
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

## Important Notes
- Ensure the ID is unique
- Coordinates must be precise for correct positioning
- ZIP code must be in the correct format (5 digits)
- Maintain consistency in region and province names (use English names)
- All URLs should include `https://` or `http://`
- Phone numbers should include international prefix
