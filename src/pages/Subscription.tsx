
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Sparkles } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, tier, expiresAt, isLoading, createCheckout, openCustomerPortal } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (selectedTier: "monthly" | "yearly") => {
    if (!user) {
      toast.error("Please log in to subscribe");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const url = await createCheckout(selectedTier);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("There was a problem processing your subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsProcessing(true);
    try {
      const url = await openCustomerPortal();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast.error("There was a problem opening the subscription management portal");
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
          <h1 className="text-4xl font-bold mb-4">Upgrade to PetPal+</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get premium features to better protect and care for your pets with PetPal+.
          </p>
        </div>

        {isSubscribed && (
          <div className="mb-12 bg-green-50 p-6 rounded-lg border border-green-200 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-green-700">
                You're a PetPal+ Member!
              </h2>
            </div>
            <p className="mb-2">
              You currently have an active <strong>{tier === "yearly" ? "yearly" : "monthly"}</strong> subscription.
            </p>
            {expiresAt && (
              <p className="text-sm text-gray-600 mb-4">
                Your subscription renews on {formatDate(expiresAt)}.
              </p>
            )}
            <Button onClick={handleManageSubscription} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Manage Subscription"}
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className={`border-2 ${tier === "monthly" ? "border-primary" : "border-gray-200"}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Monthly</CardTitle>
                {tier === "monthly" && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                    Your Plan
                  </Badge>
                )}
              </div>
              <CardDescription>Flexible monthly billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  $4.99
                  <span className="text-sm font-normal text-gray-500"> / month</span>
                </p>
              </div>
              <ul className="space-y-2">
                <FeatureItem>Priority customer support</FeatureItem>
                <FeatureItem>Automatic location alerts</FeatureItem>
                <FeatureItem>Premium pet profile templates</FeatureItem>
                <FeatureItem>Advanced pet health tracking</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              {!isSubscribed ? (
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe("monthly")}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Subscribe Monthly"}
                </Button>
              ) : tier === "monthly" ? (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleSubscribe("monthly")}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Switch to Monthly"}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className={`border-2 ${tier === "yearly" ? "border-primary" : "border-gray-200"}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Yearly</CardTitle>
                {tier === "yearly" ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                    Your Plan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-300">
                    Best Value
                  </Badge>
                )}
              </div>
              <CardDescription>Save 17% with annual billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  $49.99
                  <span className="text-sm font-normal text-gray-500"> / year</span>
                </p>
                <p className="text-sm text-amber-600 mt-1">Save $9.89 compared to monthly</p>
              </div>
              <ul className="space-y-2">
                <FeatureItem>Priority customer support</FeatureItem>
                <FeatureItem>Automatic location alerts</FeatureItem>
                <FeatureItem>Premium pet profile templates</FeatureItem>
                <FeatureItem>Advanced pet health tracking</FeatureItem>
                <FeatureItem highlight>Early access to new features</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              {!isSubscribed ? (
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe("yearly")}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Subscribe Yearly"}
                </Button>
              ) : tier === "yearly" ? (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleSubscribe("yearly")}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Switch to Yearly"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Why Choose PetPal+?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Enhanced security features to keep your pet's information safe and secure.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get faster responses from our dedicated support team whenever you need help.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">More detailed location tracking and history for your pet's QR code scans.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multiple Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Add and manage more pets with detailed profiles and customization options.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user && !authLoading && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-2">Sign in to subscribe</h3>
            <p className="mb-4">You need to be logged in to subscribe to PetPal+</p>
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

const FeatureItem = ({ children, highlight = false }: { children: React.ReactNode, highlight?: boolean }) => (
  <li className={`flex items-start ${highlight ? 'text-amber-600 font-medium' : ''}`}>
    <Check className={`h-5 w-5 mr-2 mt-0.5 ${highlight ? 'text-amber-600' : 'text-green-500'}`} />
    <span>{children}</span>
  </li>
);

export default Subscription;
