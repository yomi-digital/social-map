import React from 'react';
import { Organization } from '../types/Organization';
import Select from 'react-select';
import countryList from 'react-select-country-list';

interface FiltersProps {
  organizations: Organization[];
  onFiltersChange: (filters: {
    countries: string[];
    regions: string[];
    sectors: string[];
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ organizations, onFiltersChange }) => {
  // Ottieni la lista dei paesi disponibili dalle organizzazioni
  const uniqueCountries = React.useMemo(() => {
    const countries = new Set(organizations.map(org => org.country));
    return Array.from(countries).sort();
  }, [organizations]);

  // Ottieni le regioni per paese
  const regionsByCountry = React.useMemo(() => {
    const regions = new Map<string, Set<string>>();
    organizations.forEach(org => {
      if (!regions.has(org.country)) {
        regions.set(org.country, new Set());
      }
      regions.get(org.country)?.add(org.region);
    });
    return regions;
  }, [organizations]);

  const uniqueSectors = Array.from(new Set(organizations.map(org => org.sector))).sort();

  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = React.useState<string[]>([]);

  // Ottieni le regioni disponibili per i paesi selezionati
  const availableRegions = React.useMemo(() => {
    const regions = new Set<string>();
    selectedCountries.forEach(country => {
      regionsByCountry.get(country)?.forEach(region => regions.add(region));
    });
    return Array.from(regions).sort();
  }, [selectedCountries, regionsByCountry]);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg w-64 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <Select
          isMulti
          options={uniqueCountries.map(country => ({
            value: country,
            label: country
          }))}
          value={selectedCountries.map(country => ({
            value: country,
            label: country
          }))}
          onChange={(selected) => {
            const countries = selected ? selected.map(option => option.value) : [];
            setSelectedCountries(countries);
            setSelectedRegions([]); // Reset regions when countries change
            onFiltersChange({ countries, regions: [], sectors: selectedSectors });
          }}
          className="text-sm"
          placeholder="Select countries..."
        />
      </div>

      {selectedCountries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <Select
            isMulti
            options={availableRegions.map(region => ({
              value: region,
              label: region
            }))}
            value={selectedRegions.map(region => ({
              value: region,
              label: region
            }))}
            onChange={(selected) => {
              const regions = selected ? selected.map(option => option.value) : [];
              setSelectedRegions(regions);
              onFiltersChange({ countries: selectedCountries, regions, sectors: selectedSectors });
            }}
            className="text-sm"
            placeholder="Select regions..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sector
        </label>
        <Select
          isMulti
          options={uniqueSectors.map(sector => ({
            value: sector,
            label: sector
          }))}
          value={selectedSectors.map(sector => ({
            value: sector,
            label: sector
          }))}
          onChange={(selected) => {
            const sectors = selected ? selected.map(option => option.value) : [];
            setSelectedSectors(sectors);
            onFiltersChange({ countries: selectedCountries, regions: selectedRegions, sectors });
          }}
          className="text-sm"
          placeholder="Select sectors..."
        />
      </div>
    </div>
  );
};

export default Filters; 