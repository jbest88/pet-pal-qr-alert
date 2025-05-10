
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertCircle, Sparkles } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasDonated, donationAmount, donationDate, isLoading, createDonation } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleDonate = async (amount: number) => {
    if (!user) {
      toast.error("Please log in to donate");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const url = await createDonation(amount);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("There was a problem processing your donation");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support PetAlert</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your donations help us continue to provide this service and protect more pets.
          </p>
        </div>

        {hasDonated && (
          <div className="mb-12 bg-green-50 p-6 rounded-lg border border-green-200 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-green-700">
                Thank You For Your Support!
              </h2>
            </div>
            <p className="mb-2">
              You've donated <strong>${(donationAmount || 0) / 100}</strong> to support our mission.
            </p>
            {donationDate && (
              <p className="text-sm text-gray-600 mb-4">
                Donation date: {formatDate(donationDate)}.
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Small Donation */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Donation</CardTitle>
              <CardDescription>Support our basic operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  $5
                </p>
              </div>
              <ul className="space-y-2">
                <DonationFeature>Help maintain the website</DonationFeature>
                <DonationFeature>Support our server costs</DonationFeature>
                <DonationFeature>Our eternal gratitude</DonationFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleDonate(500)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Donate $5"}
              </Button>
            </CardFooter>
          </Card>

          {/* Medium Donation */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Standard Donation</CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-300">
                  Popular
                </Badge>
              </div>
              <CardDescription>Support our growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  $20
                </p>
              </div>
              <ul className="space-y-2">
                <DonationFeature>Help maintain the website</DonationFeature>
                <DonationFeature>Support our server costs</DonationFeature>
                <DonationFeature>Fund new features</DonationFeature>
                <DonationFeature>Support lost pet campaigns</DonationFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleDonate(2000)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Donate $20"}
              </Button>
            </CardFooter>
          </Card>

          {/* Large Donation */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Donation</CardTitle>
              <CardDescription>Make a significant impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  $50
                </p>
              </div>
              <ul className="space-y-2">
                <DonationFeature>All standard benefits</DonationFeature>
                <DonationFeature>Support educational programs</DonationFeature>
                <DonationFeature>Fund local pet rescue initiatives</DonationFeature>
                <DonationFeature>Help expand to new communities</DonationFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleDonate(5000)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Donate $50"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Why Support PetAlert?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Protect More Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your donation helps us reach more pet owners and protect more animals from getting lost.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Improve Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We use donations to improve our alert systems and develop better tracking technology.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Donations fund educational programs on pet safety and responsible ownership.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rescue Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Part of your donation goes to supporting local pet rescue organizations in their efforts.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user && !authLoading && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-2">Sign in to donate</h3>
            <p className="mb-4">You need to be logged in to make a donation</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate("/login")}>Log In</Button>
              <Button variant="outline" onClick={() => navigate("/register")}>Register</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const DonationFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <Heart className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
    <span>{children}</span>
  </li>
);

export default Subscription;
