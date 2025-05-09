
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubscriptionBanner() {
  const { isSubscribed, tier, expiresAt, isLoading } = useSubscription();
  
  if (isLoading) {
    return null;
  }

  if (isSubscribed) {
    const expiryDate = expiresAt ? new Date(expiresAt).toLocaleDateString() : "N/A";
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <h3 className="font-medium text-green-800">
                PetPal+ {tier === "yearly" ? "Yearly" : "Monthly"} Subscription Active
              </h3>
              <p className="text-sm text-gray-600">
                Your subscription renews on {expiryDate}
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/subscription">Manage Subscription</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <h3 className="font-medium text-amber-800">
              Upgrade to PetPal+
            </h3>
            <p className="text-sm text-gray-600">
              Get premium features to better protect your pets
            </p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link to="/subscription">Upgrade Now</Link>
        </Button>
      </div>
    </div>
  );
}
