import React, { useState, useEffect } from 'react';
import ItalyMap from './components/ItalyMap';
import AddOrganizationForm from './components/AddOrganizationForm';
import AddButton from './components/AddButton';
import { githubService } from './services/github';
import { Organization } from './types/Organization';
import RefreshButton from './components/RefreshButton';

// Access environment variables through import.meta.env is supported in Vite
console.log('VITE_GITHUB_TOKEN:', (import.meta as any).env.VITE_GITHUB_TOKEN);

function App() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await githubService.getFile('src/data/organizations.json');
        const content = JSON.parse(atob(response.content));
        setOrgs(content.organizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [lastUpdate]);

  return (
    <div className="h-screen relative">
      <ItalyMap organizations={orgs} />
      
      {/* Mostra i pulsanti solo quando non sta caricando */}
      {!isLoading && (
        <>
          <AddButton onClick={() => setIsFormOpen(true)} />
          <RefreshButton onRefresh={() => setLastUpdate(Date.now())} />
        </>
      )}
      
      <AddOrganizationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={() => {
          setIsFormOpen(false);
          setLastUpdate(Date.now());
        }}
      />
    </div>
  );
}

export default App; 