
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SocialMediaForm from "@/components/profile/SocialMediaForm";
import { glass } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowLeft } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_snapchat: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfileData(data as ProfileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Your Profile</h1>
          </div>

          <div className={`p-6 rounded-lg mb-8 ${glass}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="font-semibold text-xl">{profileData?.name}</h2>
                <p className="text-gray-600">{profileData?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileData?.name || ""}
                  readOnly
                  className={glass}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData?.email || ""}
                  readOnly
                  className={glass}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData?.phone || ""}
                  readOnly
                  className={glass}
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${glass}`}>
            <h2 className="text-xl font-semibold mb-4">Social Media Accounts</h2>
            <p className="text-gray-600 mb-6">
              Connect your social accounts to share updates if your pet goes missing. Only usernames are needed, not passwords.
            </p>

            <SocialMediaForm
              initialValues={{
                facebook: profileData?.social_facebook || "",
                instagram: profileData?.social_instagram || "",
                twitter: profileData?.social_twitter || "",
                snapchat: profileData?.social_snapchat || ""
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
