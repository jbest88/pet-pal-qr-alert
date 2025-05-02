
import { Database } from "@/integrations/supabase/types";

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
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
}

// Helper function to map from Supabase profile to our User type
export function mapSupabaseProfile(profile: Database["public"]["Tables"]["profiles"]["Row"]): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone
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
    imageUrl: pet.image_url
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
    createdAt: scanEvent.created_at
  };
}
