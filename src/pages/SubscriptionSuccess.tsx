
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

const SubscriptionSuccess = () => {
  const { checkDonationStatus } = useSubscription();
  
  useEffect(() => {
    // Update donation status when the component mounts
    const updateDonationStatus = async () => {
      try {
        await checkDonationStatus();
        toast.success("Thank you for your donation!");
      } catch (error) {
        console.error("Failed to update donation status:", error);
      }
    };
    
    updateDonationStatus();
  }, [checkDonationStatus]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Donation!</h1>
        <p className="text-gray-600 mb-6">
          Your generosity helps us protect more pets and ensure they find their way home safely.
        </p>
        <p className="text-gray-700 mb-8">
          We've received your donation and greatly appreciate your support of our mission.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/subscription">Back to Donations</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccess;
