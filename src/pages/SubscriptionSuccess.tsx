
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const SubscriptionSuccess = () => {
  const { checkSubscription } = useSubscription();
  
  useEffect(() => {
    // Update subscription status when the component mounts
    const updateSubscription = async () => {
      try {
        await checkSubscription();
        toast.success("Subscription was successful!");
      } catch (error) {
        console.error("Failed to update subscription status:", error);
      }
    };
    
    updateSubscription();
    
    // Set up auto-refresh interval
    const interval = setInterval(() => {
      checkSubscription();
    }, 5000); // Check every 5 seconds initially
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [checkSubscription]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Thank You for Subscribing!</h1>
        <p className="text-gray-600 mb-6">
          Your subscription to PetPal+ has been processed successfully. You now have access to all premium features to help keep your pets safe and secure.
        </p>
        <p className="text-gray-700 mb-8">
          We've refreshed your subscription status automatically. You can now enjoy all the benefits of PetPal+.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/subscription">View Subscription Details</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;
