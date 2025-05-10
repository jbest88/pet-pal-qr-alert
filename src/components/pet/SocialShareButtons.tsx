
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/types";
import { glass } from "@/lib/utils";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  pet: Pet;
}

interface UserSocialMedia {
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  snapchat: string | null;
}

export default function SocialShareButtons({ pet }: SocialShareButtonsProps) {
  const { user } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState<UserSocialMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserSocialAccounts = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('social_facebook, social_instagram, social_twitter, social_snapchat')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Type-safe access to data properties
        setSocialAccounts({
          facebook: data?.social_facebook || null,
          instagram: data?.social_instagram || null,
          twitter: data?.social_twitter || null,
          snapchat: data?.social_snapchat || null
        });
      } catch (error) {
        console.error('Error loading social accounts:', error);
        // Initialize with null values in case of error
        setSocialAccounts({
          facebook: null,
          instagram: null,
          twitter: null,
          snapchat: null
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSocialAccounts();
  }, [user]);
  
  if (!pet.isLost) return null;
  
  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded"></div>;
  }
  
  const petName = encodeURIComponent(pet.name);
  const petType = encodeURIComponent(pet.type);
  const petBreed = encodeURIComponent(pet.breed || '');
  const petLocation = encodeURIComponent(pet.lastSeenLocation || 'Unknown location');
  const petImageUrl = pet.imageUrl;
  
  // Base message text
  const shareMessage = `LOST ${petType.toUpperCase()}: ${petName} is missing! Last seen at ${petLocation}. Please contact me if found.`;
  
  const handleShare = (platform: string) => {
    if (!socialAccounts) {
      toast.error("You need to set up your social media accounts first");
      return;
    }
    
    let url = '';
    
    switch (platform) {
      case 'facebook':
        if (!socialAccounts.facebook) {
          toast.error("Please add your Facebook account in your profile settings");
          return;
        }
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
        
      case 'twitter':
        if (!socialAccounts.twitter) {
          toast.error("Please add your X/Twitter account in your profile settings");
          return;
        }
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.href)}`;
        break;
        
      case 'instagram':
        // Instagram doesn't have a direct share URL - show instructions
        toast("Instagram doesn't support direct sharing", {
          description: "To share on Instagram, copy this link and create a post with the pet's image",
          action: {
            label: "Copy Link",
            onClick: () => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }
          }
        });
        return;
        
      default:
        return;
    }
    
    // Open share dialog in a new window
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const hasSocialAccounts = socialAccounts && 
    (socialAccounts.facebook || socialAccounts.twitter || socialAccounts.instagram);
    
  if (!hasSocialAccounts) {
    return (
      <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-lg text-sm">
        <p className="mb-2">Add your social media accounts to easily share when pets go missing.</p>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => window.location.href = "/profile"}
        >
          Set Up Social Accounts
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Share on Social Media:</h3>
      <div className="flex flex-wrap gap-2">
        {socialAccounts?.facebook && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`${glass} hover:bg-blue-100`}
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-4 w-4 text-blue-600 mr-2" />
            Share on Facebook
          </Button>
        )}
        
        {socialAccounts?.twitter && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`${glass} hover:bg-blue-50`}
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-4 w-4 text-blue-400 mr-2" />
            Share on X/Twitter
          </Button>
        )}
        
        {socialAccounts?.instagram && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`${glass} hover:bg-pink-50`}
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-4 w-4 text-pink-600 mr-2" />
            Share on Instagram
          </Button>
        )}
      </div>
    </div>
  );
}
