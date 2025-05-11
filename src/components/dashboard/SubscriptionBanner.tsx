
import { useContext } from "react";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function SubscriptionBanner() {
  const { hasDonated } = useContext(SubscriptionContext);
  
  if (hasDonated) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <h3 className="font-medium">Support Pet Pal QR</h3>
        </div>
        <div className="flex-1 text-sm text-gray-600">
          Help us continue protecting pets with a donation. Every contribution helps!
        </div>
        <Button asChild className="whitespace-nowrap">
          <Link to="/subscription">
            Donate Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
