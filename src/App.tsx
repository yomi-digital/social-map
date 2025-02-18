import React, { useState, useEffect, useMemo } from 'react';
import ItalyMap from './components/ItalyMap';
import AddOrganizationForm from './components/AddOrganizationForm';
import AddButton from './components/AddButton';
import Filters from './components/Filters';
import SearchBar from './components/SearchBar';
import { githubService } from './services/github';
import { Organization, Sector } from './types/Organization';
import RefreshButton from './components/RefreshButton';

console.log('VITE_GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN);

const SECTORS: Sector[] = [
  'Hackerspace', 'Coworking', 'Fablab', 'Events', 'Permaculture', 
  'Web3', 'Local Projects', 'Inner Development', 'Education',
  'Urban Garden', 'Open To Residences', 'Other'
];

function App() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Filtri
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Liste per i filtri
  const regions = useMemo(() => [...new Set(orgs.map(org => org.region))].sort(), [orgs]);
  const provinces = useMemo(() => [...new Set(orgs.map(org => org.province))].sort(), [orgs]);
  const cities = useMemo(() => [...new Set(orgs.map(org => org.city))].sort(), [orgs]);

  // Organizzazioni filtrate
  const filteredOrgs = useMemo(() => {
    return orgs.filter(org => {
      const matchesRegion = !selectedRegion || org.region === selectedRegion;
      const matchesProvince = !selectedProvince || org.province === selectedProvince;
      const matchesCity = !selectedCity || org.city === selectedCity;
      const matchesSectors = selectedSectors.length === 0 || 
        selectedSectors.some(s => org.sectors.includes(s));
      const matchesSearch = !searchQuery || 
        org.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRegion && matchesProvince && matchesCity && matchesSectors && matchesSearch;
    });
  }, [orgs, selectedRegion, selectedProvince, selectedCity, selectedSectors, searchQuery]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await githubService.getFile('src/data/organizations.json');
        const content = JSON.parse(atob(response.content));
        setOrgs(content.organizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, [lastUpdate]); // Ricarica quando lastUpdate cambia

  const handleFormSubmitSuccess = () => {
    setIsFormOpen(false);
    // Forza il refresh dei dati
    setLastUpdate(Date.now());
  };

  const handleRefresh = () => {
    setLastUpdate(Date.now());
  };

  return (
    <div className="h-screen relative">
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-4 max-w-sm">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Filters
          regions={regions}
          provinces={provinces}
          cities={cities}
          sectors={SECTORS}
          selectedRegion={selectedRegion}
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          selectedSectors={selectedSectors}
          onRegionChange={setSelectedRegion}
          onProvinceChange={setSelectedProvince}
          onCityChange={setSelectedCity}
          onSectorChange={setSelectedSectors}
        />
      </div>
      
      <ItalyMap 
        organizations={filteredOrgs}
        selectedRegion={selectedRegion}
        selectedProvince={selectedProvince}
        selectedCity={selectedCity}
      />
      
      <AddButton onClick={() => setIsFormOpen(true)} />
      <RefreshButton onRefresh={handleRefresh} />
      <AddOrganizationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={handleFormSubmitSuccess}
      />
    </div>
  );
}

export default App; 