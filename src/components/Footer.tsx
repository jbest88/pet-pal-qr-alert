
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <PawPrint className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">PetPal</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-gray-800">
              How It Works
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-800">
              Privacy
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          © {currentYear} PetPal QR Alert. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
