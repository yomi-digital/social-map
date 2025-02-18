import React, { useState } from 'react';
import { Sector } from '../types/Organization';

interface FiltersProps {
  regions: string[];
  provinces: string[];
  cities: string[];
  sectors: Sector[];
  selectedRegion: string;
  selectedProvince: string;
  selectedCity: string;
  selectedSectors: Sector[];
  onRegionChange: (region: string) => void;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onSectorChange: (sectors: Sector[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  regions,
  provinces,
  cities,
  sectors,
  selectedRegion,
  selectedProvince,
  selectedCity,
  selectedSectors,
  onRegionChange,
  onProvinceChange,
  onCityChange,
  onSectorChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">Filters</h3>
        <svg 
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sectors</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sectors.map(sector => (
                <label key={sector} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sector)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSectorChange([...selectedSectors, sector]);
                      } else {
                        onSectorChange(selectedSectors.filter(s => s !== sector));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{sector}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters; 