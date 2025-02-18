import React, { useState, useEffect } from 'react';
import ItalyMap from './components/ItalyMap';
import AddOrganizationForm from './components/AddOrganizationForm';
import AddButton from './components/AddButton';
import organizations from './data/organizations.json';

console.log('VITE_GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN);

function App() {
  const [orgs, setOrgs] = useState(organizations.organizations);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="h-screen relative">
      <ItalyMap organizations={orgs} />
      <AddButton onClick={() => setIsFormOpen(true)} />
      <AddOrganizationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}

export default App; 