import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";

export async function getQRLinkForPet(petId: string): Promise<string> {
  try {
    console.log(`Getting QR link for pet ${petId}`);
    
    // First try to find an existing QR link for this pet
    const { data: existingLink, error: fetchError } = await supabase
      .from('qr_links')
      .select('slug')
      .eq('pet_id', petId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("Error fetching QR link:", fetchError);
      throw fetchError;
    }

    // If we found an existing link, use it
    if (existingLink && existingLink.slug) {
      console.log(`Using existing QR link for pet ${petId}: ${existingLink.slug}`);
      return existingLink.slug;
    }

    // Otherwise, create a new one
    const newSlug = nanoid(10); // Generate a short, unique ID for the QR link
    console.log(`Creating new QR link for pet ${petId} with slug: ${newSlug}`);
    
    const { error: insertError } = await supabase
      .from('qr_links')
      .insert({
        pet_id: petId,
        slug: newSlug
      });

    if (insertError) {
      console.error("Error inserting QR link:", insertError);
      throw insertError;
    }
    
    console.log(`Created new QR link for pet ${petId}: ${newSlug}`);
    return newSlug;
  } catch (error) {
    console.error("Error getting QR link:", error);
    throw new Error("Failed to get or create QR link");
  }
}

export function buildQRCodeUrl(slug: string): string {
  if (!slug) {
    console.error("No slug provided for QR code URL");
    throw new Error("No slug provided for QR code URL");
  }
  
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/qr/${slug}`;
  console.log(`Built QR code URL: ${fullUrl} for slug: ${slug}`);
  return fullUrl;
}
