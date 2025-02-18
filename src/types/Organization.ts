export interface Organization {
  id: string;
  name: string;
  city: string;
  region: string;
  province: string;
  address: string;
  zipCode: string;
  sector: 'Hackerspace' | 'Coworking' | 'Fablab' | 'Events' | 'Permaculture' | 'Web3' | 'Local projects' | 'Inner development' | 'Education';
  website?: string;
  email?: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
} 