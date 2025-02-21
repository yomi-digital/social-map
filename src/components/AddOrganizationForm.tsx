import React, { useState } from 'react';
import { Organization } from '../types/Organization';
import { githubService } from '../services/github';
import { getCoordinates } from '../services/geocoding';

type Sector = Organization['sector'];

const SECTORS: Sector[] = [
  'Hackerspace',
  'Coworking',
  'Fablab',
  'Events',
  'Permaculture',
  'Web3',
  'Local projects',
  'Inner development',
  'Education'
];

interface AddOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const AddOrganizationForm = ({ isOpen, onClose, onSubmitSuccess }: AddOrganizationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    region: '',
    province: '',
    address: '',
    zipCode: '',
    sector: '' as Sector,
    website: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prima ottieni le coordinate
      const coordinates = await getCoordinates(formData.address, formData.city, formData.zipCode);
      
      if (!coordinates) {
        throw new Error('Non è stato possibile trovare le coordinate per questo indirizzo');
      }

      const id = Date.now().toString();
      const newOrganization = {
        id,
        ...formData,
        coordinates // Includi le coordinate nell'oggetto
      };

      const filePath = 'src/data/organizations.json';
      const branchName = `add-org-${id}`;

      console.log('1. Fetching current file...');
      const currentFile = await githubService.getFile(filePath);
      
      console.log('2. Decoding and updating content...');
      const currentContent = JSON.parse(atob(currentFile.content));
      currentContent.organizations.push(newOrganization);
      
      console.log('3. Creating new branch...');
      await githubService.createBranch(branchName, currentFile.sha);
      
      console.log('4. Updating file...');
      await githubService.updateFile(
        filePath,
        JSON.stringify(currentContent, null, 2),
        `Add ${formData.name} with coordinates`,
        branchName,
        currentFile.sha
      );
      
      console.log('5. Creating PR...');
      await githubService.createPR(
        `Add ${formData.name}`,
        `Add new organization: ${formData.name}\n\nCoordinates: ${JSON.stringify(coordinates)}\n\n\`\`\`json\n${JSON.stringify(newOrganization, null, 2)}\n\`\`\``,
        branchName
      );

      alert('Pull Request creata con successo! Grazie per il contributo.');
      onClose();
      onSubmitSuccess();
    } catch (error) {
      console.error('Error:', error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white rounded-lg shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Your Space</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Città</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Regione</label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Provincia</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Indirizzo</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">CAP</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{5}"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Settore</label>
                <select
                  required
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value as Sector})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleziona un settore</option>
                  {SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+39 "
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Genera JSON
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizationForm; 