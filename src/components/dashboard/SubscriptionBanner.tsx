import { useContext } from "react";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";

export default function SubscriptionBanner() {
  // Keep the subscription context available for future use
  const { subscribed } = useContext(SubscriptionContext);
  
  // Return empty component - subscription functionality is in the background
  return null;
}
