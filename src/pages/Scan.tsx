import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { PawPrint, Send, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabasePet } from "@/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Scan = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [rawData, setRawData] = useState<any>(null); // For debugging
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    const loadPetData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!scanId) {
          console.error("No scan ID provided in URL parameters");
          setError("Missing scan ID");
          setIsLoading(false);
          return;
        }
        
        console.log("🔍 Looking for pet with ID:", scanId);
        
        // First, check if the scanId is valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(scanId)) {
          console.error("Invalid UUID format:", scanId);
          setError(`Invalid ID format: ${scanId}`);
          setIsLoading(false);
          return;
        }
        
        // Directly fetch the pet from Supabase using the scanId which is the pet ID
        // Using .select('*') to get all fields and not using .single() to avoid errors
        const response = await supabase
          .from('pets')
          .select('*')
          .eq('id', scanId)
          .maybeSingle();
          
        setRawData(response); // Store raw response for debugging
        
        if (response.error) {
          console.error("❌ Error fetching pet:", response.error);
          setError(`Database error: ${response.error.message}`);
          toast.error("Failed to load pet information");
        } else if (response.data) {
          const mappedPet = mapSupabasePet(response.data);
          console.log("✅ Found pet:", mappedPet);
          setPet(mappedPet);
        } else {
          console.log("❓ No pet found with ID:", scanId);
          setError(`No pet found with ID: ${scanId}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("❌ Error loading pet data:", err);
        setError(`Error loading pet data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Get user's location if available
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("📍 Got user location:", { latitude, longitude });
            
            // Set initial location with coordinates only
            setLocation({
              lat: latitude,
              lng: longitude
            });
            
            // Use reverse geocoding to get the address
            fetchAddress(latitude, longitude);
          },
          (error) => {
            console.error("❌ Error getting location:", error);
          }
        );
      } else {
        console.log("⚠️ Geolocation not supported by this browser");
      }
    };
    
    loadPetData();
    getLocation();
  }, [scanId]);
  
  // Function to fetch address from coordinates using OpenStreetMap Nominatim API
  const fetchAddress = async (latitude: number, longitude: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PetPalQRAlert/1.0'  // Required by Nominatim usage policy
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      console.log("📍 Reverse geocoding result:", data);
      
      // Format the address using available data
      const addressParts = [];
      
      if (data.address) {
        const addr = data.address;
        // Format a readable address with available parts
        if (addr.road) addressParts.push(addr.road);
        if (addr.suburb) addressParts.push(addr.suburb);
        if (addr.city || addr.town || addr.village) {
          addressParts.push(addr.city || addr.town || addr.village);
        }
        if (addr.state) addressParts.push(addr.state);
        if (addr.postcode) addressParts.push(addr.postcode);
      }
      
      const formattedAddress = addressParts.length > 0 
        ? addressParts.join(', ') 
        : data.display_name || 'Unknown location';
      
      console.log("📍 Formatted address:", formattedAddress);
      
      // Update location with the resolved address
      setLocation(prev => prev ? {
        ...prev,
        address: formattedAddress
      } : null);
      
    } catch (error) {
      console.error("❌ Error fetching address:", error);
      // Keep the location object but mark address as failed
      setLocation(prev => prev ? {
        ...prev,
        address: "Address lookup failed"
      } : null);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pet) {
      toast.error("No pet information available");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("📝 Submitting scan event for pet:", pet.id);
      
      // Create a scan event in Supabase
      const { error } = await supabase
        .from('scan_events')
        .insert({
          pet_id: pet.id,
          lat: location?.lat,
          lng: location?.lng,
          address: location?.address || null,
          scanner_contact: contactInfo || null,
          message: message || null
        });
        
      if (error) {
        console.error("❌ Error creating scan event:", error);
        throw error;
      }
      
      console.log("✅ Scan event created successfully");
      toast.success("Alert sent to the pet owner!");
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      toast.error("Failed to send alert. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    // Re-run the effect
    const loadPetData = async () => {
      setIsLoading(true);
      
      try {
        console.log("🔄 Retrying fetch for pet with ID:", scanId);
        
        // Direct fetch from Supabase with no caching
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', scanId)
          .maybeSingle();
          
        if (error) {
          console.error("❌ Retry error fetching pet:", error);
          setError(`Database error during retry: ${error.message}`);
        } else if (data) {
          const mappedPet = mapSupabasePet(data);
          console.log("✅ Retry successful - Found pet:", mappedPet);
          setPet(mappedPet);
          setError(null);
        } else {
          console.log("❓ Retry - No pet found with ID:", scanId);
          setError(`Retry failed - No pet found with ID: ${scanId}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("❌ Error during retry:", err);
        setError(`Error during retry: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPetData();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Looking for pet information...</p>
            <p className="text-xs text-gray-500 mt-2">Scan ID: {scanId || "None"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !pet) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <PawPrint className="h-16 w-16 mx-auto text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find a pet associated with this QR code. It may have been removed or the code is invalid.
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Debug Information</AlertTitle>
              <AlertDescription className="mt-1 break-words">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {rawData && (
              <div className="bg-gray-50 p-4 rounded-md text-left text-xs overflow-auto max-h-40">
                <p className="font-semibold mb-1">Raw Response:</p>
                <pre>{JSON.stringify(rawData, null, 2)}</pre>
              </div>
            )}
            
            <Button onClick={retryFetch} className="w-full">
              Try Again
            </Button>
            
            <div className="pt-4 text-sm text-gray-500">
              <p>Scan ID: {scanId || "None"}</p>
              <p className="mt-1">If this error persists, please contact support.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    // Display information about the scan event that was submitted
    const scanDateTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md text-center">
          <div className="bg-green-100 text-green-800 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Alert Sent!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for helping {pet.name} get home! The owner has been notified with your contact information and location.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h2 className="font-medium mb-2">Scan Details:</h2>
            <p className="text-sm text-gray-600">{scanDateTime}</p>
            <p className="text-sm text-gray-600">
              {location?.address || (isLoadingAddress ? "Determining address..." : "Location unavailable")}
            </p>
          </div>
          
          <p className="font-medium">What should you do now?</p>
          <ul className="mt-4 text-left space-y-2">
            <li className="flex items-start">
              <span className="bg-primary/20 rounded-full p-1 mr-2 mt-1">
                <PawPrint className="h-4 w-4 text-primary" />
              </span>
              <span>Wait for the owner to contact you</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 rounded-full p-1 mr-2 mt-1">
                <PawPrint className="h-4 w-4 text-primary" />
              </span>
              <span>Keep the pet safe and comfortable</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 rounded-full p-1 mr-2 mt-1">
                <PawPrint className="h-4 w-4 text-primary" />
              </span>
              <span>If possible, stay where you found the pet</span>
            </li>
          </ul>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <PawPrint className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">You've Found {pet.name}!</h1>
          <p className="text-gray-600">
            Please help {pet.name} get back home by sending an alert to the owner.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Pet Information</h2>
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Type:</strong> {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
            {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
            {pet.description && (
              <div className="mt-2">
                <p><strong>Description:</strong></p>
                <p className="text-gray-600">{pet.description}</p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactInfo">Your Contact Information (optional)</Label>
              <Input
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone number or email address"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                So the owner can thank you and arrange to pick up their pet
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message to Owner (optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include any details about where you found the pet or its condition"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Alert..." : "Send Alert to Owner"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Scan;
