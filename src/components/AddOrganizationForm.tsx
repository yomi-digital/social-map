import React, { useState, useMemo } from 'react';
import { Organization } from '../types/Organization';
import { githubService } from '../services/github';
import { getCoordinates } from '../services/geocoding';
import Select from 'react-select';
import { normalizeCountryName, NORMALIZED_COUNTRIES } from '../utils/countryNormalization';

type Sector = Organization['sector'];

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

interface AddOrganizationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const AddOrganizationForm = ({ isOpen, onClose, onSubmitSuccess }: AddOrganizationFormProps) => {
  const ALL_COUNTRIES = useMemo(() => {
    const uniqueCountries = new Set(Object.values(NORMALIZED_COUNTRIES));
    return Array.from(uniqueCountries).sort().map(country => ({
      value: country,
      label: country
    }));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: 'Italy',
    region: '',
    province: '',
    address: '',
    zipCode: '',
    sectors: [] as string[],
    website: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const normalizedFormData = {
        ...formData,
        country: normalizeCountryName(formData.country || 'Italy')
      };

      const coordinates = await getCoordinates(
        normalizedFormData.address, 
        normalizedFormData.city, 
        normalizedFormData.zipCode, 
        normalizedFormData.country
      );
      
      if (!coordinates) {
        throw new Error('Non è stato possibile trovare le coordinate per questo indirizzo');
      }

      const id = `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

      const newOrganization = {
        id,
        ...normalizedFormData,
        coordinates
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
    } finally {
      setIsSubmitting(false);
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
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <Select
                  options={ALL_COUNTRIES}
                  value={ALL_COUNTRIES.find(country => country.value === formData.country)}
                  onChange={(option) => setFormData({...formData, country: option?.value || ''})}
                  className="mt-1"
                  placeholder="Type to search countries..."
                  isSearchable={true}
                  noOptionsMessage={() => "No countries found"}
                  filterOption={(option, input) => {
                    if (!input) return true;
                    const searchInput = input.toLowerCase();
                    return (
                      option.label.toLowerCase().includes(searchInput) ||
                      Object.entries(NORMALIZED_COUNTRIES).some(([key, value]) => 
                        key.toLowerCase().includes(searchInput) && 
                        value === option.value
                      )
                    );
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Province</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
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
                <label className="block text-sm font-medium text-gray-700">Sectors</label>
                <Select
                  isMulti
                  options={SECTORS}
                  value={SECTORS.filter(sector => formData.sectors.includes(sector.value))}
                  onChange={(selected) => {
                    const sectors = selected ? selected.map(option => option.value) : [];
                    setFormData({...formData, sectors});
                  }}
                  className="mt-1"
                  placeholder="Select sectors..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
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
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizationForm; 