
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const SubscriptionCanceled = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <AlertCircle className="h-20 w-20 text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Donation Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your donation process was canceled. No charges have been made to your account.
        </p>
        <p className="text-gray-700 mb-8">
          If you experienced any issues during the donation process or have any questions, please don't hesitate to contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/subscription">Try Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionCanceled;
