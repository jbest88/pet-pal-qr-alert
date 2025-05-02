
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed?: string;
  description?: string;
  imageUrl?: string;
  qrCodeUrl: string;
}

export interface ScanEvent {
  id: string;
  petId: string;
  timestamp: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  scannerContact?: string;
  message?: string;
}
