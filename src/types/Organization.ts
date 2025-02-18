export type Sector = 'Hackerspace' | 'Coworking' | 'Fablab' | 'Events' | 'Permaculture' | 
                    'Web3' | 'Local Projects' | 'Inner Development' | 'Education' | 
                    'Urban Garden' | 'Open To Residences' | 'Other';

export interface Organization {
  id: string;
  name: string;
  city: string;
  region: string;
  province: string;
  address: string;
  zipCode: string;
  sectors: Sector[];
  website?: string;
  email?: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
} 