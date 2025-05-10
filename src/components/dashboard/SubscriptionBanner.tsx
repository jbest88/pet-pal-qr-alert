import { useContext } from "react";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";

export default function SubscriptionBanner() {
  const { isSubscribed } = useContext(SubscriptionContext);
  
  return null;
}
