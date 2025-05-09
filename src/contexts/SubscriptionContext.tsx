
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionState {
  isSubscribed: boolean;
  tier: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (tier: "monthly" | "yearly") => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setIsSubscribed(false);
      setTier(null);
      setExpiresAt(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Checking subscription status...");
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        toast.error("Failed to check subscription status");
        return;
      }
      
      console.log("Subscription check response:", data);
      
      setIsSubscribed(data.subscribed || false);
      setTier(data.subscription_tier);
      setExpiresAt(data.subscription_end);
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast.error("Failed to check subscription status");
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (tier: "monthly" | "yearly"): Promise<string | null> => {
    if (!user) {
      toast.error("You must be logged in to subscribe");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier }
      });

      if (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Failed to create checkout session");
        return null;
      }

      return data?.url || null;
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Failed to create checkout session");
      return null;
    }
  };

  const openCustomerPortal = async (): Promise<string | null> => {
    if (!user) {
      toast.error("You must be logged in to manage your subscription");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) {
        console.error("Error opening customer portal:", error);
        toast.error("Failed to open customer portal");
        return null;
      }

      return data?.url || null;
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open customer portal");
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        tier,
        expiresAt,
        isLoading,
        checkSubscription,
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
