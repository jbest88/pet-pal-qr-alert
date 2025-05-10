
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DonationState {
  hasDonated: boolean;
  donationAmount: number | null;
  donationDate: string | null;
  isLoading: boolean;
  checkDonationStatus: () => Promise<void>;
  createDonation: (amount: number) => Promise<string | null>;
}

export const SubscriptionContext = createContext<DonationState | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasDonated, setHasDonated] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [donationDate, setDonationDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkDonationStatus = async () => {
    if (!user) {
      setHasDonated(false);
      setDonationAmount(null);
      setDonationDate(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Checking donation status...");
      
      const { data, error } = await supabase.functions.invoke("check-donation");
      
      if (error) {
        console.error("Error checking donation status:", error);
        toast.error("Failed to check donation status");
        return;
      }
      
      console.log("Donation check response:", data);
      
      setHasDonated(data.hasDonated || false);
      setDonationAmount(data.donationAmount);
      setDonationDate(data.donationDate);
    } catch (error) {
      console.error("Error checking donation status:", error);
      toast.error("Failed to check donation status");
    } finally {
      setIsLoading(false);
    }
  };

  const createDonation = async (amount: number): Promise<string | null> => {
    if (!user) {
      toast.error("You must be logged in to make a donation");
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: { amount }
      });

      if (error) {
        console.error("Error creating donation session:", error);
        toast.error("Failed to create donation session");
        return null;
      }

      return data?.url || null;
    } catch (error) {
      console.error("Error creating donation:", error);
      toast.error("Failed to create donation session");
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      checkDonationStatus();
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        hasDonated,
        donationAmount,
        donationDate,
        isLoading,
        checkDonationStatus,
        createDonation
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
