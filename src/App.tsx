import React, { useState, useEffect } from 'react';
import ItalyMap from './components/ItalyMap';
import AddOrganizationForm from './components/AddOrganizationForm';
import AddButton from './components/AddButton';
import { githubService } from './services/github';
import { Organization } from './types/Organization';
import RefreshButton from './components/RefreshButton';

console.log('VITE_GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN);

function App() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

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
      <ItalyMap organizations={orgs} />
      <AddButton onClick={() => setIsFormOpen(true)} />
      <RefreshButton onRefresh={handleRefresh} />
      <AddOrganizationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={handleRefresh}
      />
    </div>
  );
}

export default App; 