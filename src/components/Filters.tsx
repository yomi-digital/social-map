import React, { useState } from 'react';
import { Organization } from '../types/Organization';
import Select from 'react-select';
import { normalizeCountryName } from '../utils/countryNormalization';
import { FaFilter } from 'react-icons/fa';

// Aggiungiamo la stessa lista di settori usata nel form
const SECTORS = [
  { value: 'Hackerspace', label: 'Hackerspace' },
  { value: 'Coworking', label: 'Coworking' },
  { value: 'Fablab', label: 'Fablab' },
  { value: 'Events', label: 'Events' },
  { value: 'Permaculture', label: 'Permaculture' },
  { value: 'Web3', label: 'Web3' },
  { value: 'Local Projects', label: 'Local Projects' },
  { value: 'Inner Development', label: 'Inner Development' },
  { value: 'Education', label: 'Education' },
  { value: 'Urban Garden', label: 'Urban Garden' },
  { value: 'Open To Residences', label: 'Open To Residences' },
  { value: 'Other', label: 'Other' }
];

interface FiltersProps {
  organizations: Organization[];
  onFiltersChange: (filters: {
    countries: string[];
    regions: string[];
    sectors: string[];
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ organizations, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Debug per vedere cosa riceviamo
  console.log('Organizations:', organizations.map(org => org.country));

  // Ottieni la lista dei paesi disponibili dalle organizzazioni
  const uniqueCountries = React.useMemo(() => {
    const countries = new Set(
      organizations
        .filter(org => org && org.country) // Filtra organizzazioni senza paese
        .map(org => {
          const normalized = normalizeCountryName(org.country);
          console.log(`Normalizing ${org.country} to ${normalized}`); // Debug
          return normalized;
        })
    );
    const sortedCountries = Array.from(countries).sort();
    console.log('Available countries:', sortedCountries); // Debug
    return sortedCountries;
  }, [organizations]);

  // Ottieni le regioni per paese
  const regionsByCountry = React.useMemo(() => {
    const regions = new Map<string, Set<string>>();
    organizations
      .filter(org => org && org.country && org.region) // Filtra organizzazioni senza paese o regione
      .forEach(org => {
        const normalizedCountry = normalizeCountryName(org.country);
        if (!regions.has(normalizedCountry)) {
          regions.set(normalizedCountry, new Set());
        }
        regions.get(normalizedCountry)?.add(org.region);
      });
    return regions;
  }, [organizations]);

  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = React.useState<string[]>([]);

  // Ottieni le regioni disponibili per i paesi selezionati
  const availableRegions = React.useMemo(() => {
    if (selectedCountries.length === 0) return [];
    const regions = new Set<string>();
    selectedCountries.forEach(country => {
      regionsByCountry.get(country)?.forEach(region => regions.add(region));
    });
    return Array.from(regions).sort();
  }, [selectedCountries, regionsByCountry]);

  return (
    <div className="absolute top-4 left-[80px] z-[1000]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
        title="Toggle filters"
      >
        <FaFilter className={`w-5 h-5 ${isOpen ? 'text-blue-500' : 'text-gray-600'}`} />
      </button>

      {isOpen && (
        <div className="mt-2 bg-white p-4 rounded-lg shadow-lg w-64 space-y-4">
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
                console.log('Selected countries:', countries); // Debug
                setSelectedCountries(countries);
                setSelectedRegions([]);
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
              options={SECTORS}
              value={SECTORS.filter(sector => selectedSectors.includes(sector.value))}
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
      )}
    </div>
  );
};

export default Filters; 