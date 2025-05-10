
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function HeaderProfileLink() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/profile" className="flex items-center justify-center">
              <User className="h-5 w-5" />
              <span className="sr-only">My Profile</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>My Profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
