
import { Database } from "@/integrations/supabase/types";

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  created_at: string; // Added this property to fix TypeScript errors
}

// Pet Types
export interface Pet {
  id: string;
  name: string;
  ownerId: string;
  type: "dog" | "cat" | "other";
  breed?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  qrCodeUrl?: string | null;
  isLost?: boolean;
  lastSeenLocation?: string | null;
  lostDate?: string | null;
}

// Scan Event Types
export interface ScanEvent {
  id: string;
  petId: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  scannerContact?: string | null;
  message?: string | null;
  createdAt: string;
  timestamp?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
}

// Helper function to map from Supabase profile to our User type
export function mapSupabaseProfile(profile: Database["public"]["Tables"]["profiles"]["Row"]): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    created_at: profile.created_at
  };
}

// Helper function to map from Supabase pet to our Pet type
export function mapSupabasePet(pet: Database["public"]["Tables"]["pets"]["Row"]): Pet {
  return {
    id: pet.id,
    name: pet.name,
    ownerId: pet.owner_id,
    type: pet.type as "dog" | "cat" | "other",
    breed: pet.breed,
    description: pet.description,
    imageUrl: pet.image_url,
    qrCodeUrl: `/pet/${pet.id}`,
    isLost: pet.is_lost,
    lastSeenLocation: pet.last_seen_location,
    lostDate: pet.lost_date
  };
}

// Helper function to map from Supabase scan event to our ScanEvent type
export function mapSupabaseScanEvent(scanEvent: Database["public"]["Tables"]["scan_events"]["Row"]): ScanEvent {
  return {
    id: scanEvent.id,
    petId: scanEvent.pet_id,
    latitude: scanEvent.lat,
    longitude: scanEvent.lng,
    address: scanEvent.address,
    scannerContact: scanEvent.scanner_contact,
    message: scanEvent.message,
    createdAt: scanEvent.created_at,
    timestamp: new Date(scanEvent.created_at).getTime(),
    location: scanEvent.lat && scanEvent.lng ? {
      lat: scanEvent.lat,
      lng: scanEvent.lng,
      address: scanEvent.address || undefined
    } : null
  };
}
