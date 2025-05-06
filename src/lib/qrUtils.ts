
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";

export async function getQRLinkForPet(petId: string): Promise<string> {
  try {
    // First try to find an existing QR link for this pet
    const { data: existingLink, error: fetchError } = await supabase
      .from('qr_links')
      .select('slug')
      .eq('pet_id', petId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw fetchError;
    }

    // If we found an existing link, use it
    if (existingLink) {
      console.log(`Using existing QR link for pet ${petId}: ${existingLink.slug}`);
      return existingLink.slug;
    }

    // Otherwise, create a new one
    const newSlug = nanoid(10); // Generate a short, unique ID for the QR link
    
    const { error: insertError } = await supabase
      .from('qr_links')
      .insert({
        pet_id: petId,
        slug: newSlug
      });

    if (insertError) throw insertError;
    
    console.log(`Created new QR link for pet ${petId}: ${newSlug}`);
    return newSlug;
  } catch (error) {
    console.error("Error getting QR link:", error);
    throw new Error("Failed to get or create QR link");
  }
}

export function buildQRCodeUrl(slug: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/qr/${slug}`;
}
