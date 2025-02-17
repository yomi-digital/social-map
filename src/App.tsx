import React, { useEffect, useState } from 'react';
import ItalyMap from './components/ItalyMap';
import { Organization } from './types/Organization';
import organizationsData from './data/organizations.json';

function App() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    setOrganizations(organizationsData.organizations);
  }, []);

  return (
    <div className="w-full h-full">
      <ItalyMap organizations={organizations} />
    </div>
  );
}

export default App; 