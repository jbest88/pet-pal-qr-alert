
import { Link } from "react-router-dom";
import { PlusCircle, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glass } from "@/lib/utils";

const EmptyPetState = () => {
  return (
    <div className={`text-center py-12 rounded-lg ${glass}`}>
      <Scan className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Pets Yet</h2>
      <p className="text-gray-500 mb-6">
        Add your first pet to generate a QR code for their collar.
      </p>
      <Button asChild className={`${glass} hover:bg-white/40 transition-all duration-300 text-black`}>
        <Link to="/add-pet">
          <PlusCircle className="h-4 w-4 mr-2" /> Get Started
        </Link>
      </Button>
    </div>
  );
};

export default EmptyPetState;
