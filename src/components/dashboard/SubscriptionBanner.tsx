
import { useContext } from "react";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";

export default function SubscriptionBanner() {
  const { hasDonated } = useContext(SubscriptionContext);
  
  return null;
}
