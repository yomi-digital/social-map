export interface Organization {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  province: string;
  address: string;
  zipCode: string;
  sector: 'Hackerspace' | 'Coworking' | 'Fablab' | 'Events' | 'Permaculture' | 'Web3' | 'Local Projects' | 'Inner Development' | 'Education'| 'Urban Garden' | 'Open To Residences' | 'Other';
  website?: string;
  email?: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
} 