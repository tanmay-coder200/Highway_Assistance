export type ServiceType =
  | 'tyre-puncture'
  | 'fuel-assistance'
  | 'battery-jumpstart'
  | 'towing'
  | 'mechanical-help';

export interface Service {
  id: ServiceType;
  name: string;
  icon: string;
}

export interface Provider {
  id: string;
  name: string;
  services: ServiceType[];
  latitude: number;
  longitude: number;
  isOpen: boolean;
  verified: boolean;
  phone: string;
  // calculated at runtime from user location
  calculatedDistance?: number;
  calculatedEta?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}
