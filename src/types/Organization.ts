export interface Organization {
  id: string;
  name: string;
  city: string;
  region: string;
  province: string;
  address: string;
  cap: string;
  sector: string;
  coordinates: {
    lat: number;
    lng: number;
  };
} 