
// Interface definitions for the application
// These match the Supabase database structure

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Pet {
  id: string;
  ownerId: string; // Matches owner_id in the database
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed?: string | null;
  description?: string | null;
  imageUrl?: string | null; // Matches image_url in the database
  qrCodeUrl?: string; // Generated from the pet ID
  created_at?: string;
}

export interface ScanEvent {
  id: string;
  petId: string; // Matches pet_id in the database
  timestamp: number;
  location?: {
    lat: number | null;
    lng: number | null;
    address?: string | null;
  };
  scannerContact?: string | null;
  message?: string | null;
  created_at?: string;
}

// Helper to convert from Supabase types to our application types
export const mapSupabaseProfile = (profile: any): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  phone: profile.phone
});

export const mapSupabasePet = (pet: any): Pet => ({
  id: pet.id,
  ownerId: pet.owner_id,
  name: pet.name,
  type: pet.type as 'dog' | 'cat' | 'other',
  breed: pet.breed,
  description: pet.description,
  imageUrl: pet.image_url,
  qrCodeUrl: pet.id, // We'll use the pet ID as the QR code URL
  created_at: pet.created_at
});

export const mapSupabaseScanEvent = (event: any): ScanEvent => ({
  id: event.id,
  petId: event.pet_id,
  timestamp: new Date(event.created_at).getTime(),
  location: {
    lat: event.lat,
    lng: event.lng,
    address: event.address
  },
  scannerContact: event.scanner_contact,
  message: event.message,
  created_at: event.created_at
});
