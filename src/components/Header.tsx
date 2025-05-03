
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X, LogIn, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const NavLinks = () => (
    <>
      <Link to="/" onClick={closeMenu}>
        <Button variant="ghost">Home</Button>
      </Link>
      <Link to="/lost-pets" onClick={closeMenu}>
        <Button variant="ghost" className="flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
          Lost Pets
        </Button>
      </Link>
      {user ? (
        <>
          <Link to="/dashboard" onClick={closeMenu}>
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Button onClick={() => { logout(); closeMenu(); }} variant="ghost">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={closeMenu}>
            <Button variant="ghost">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>
          <Link to="/register" onClick={closeMenu}>
            <Button variant="secondary">Register</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-800">PetPal</span>
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {menuOpen ? <X /> : <Menu />}
            </Button>
            
            {menuOpen && (
              <div className="fixed inset-0 z-50 bg-white pt-16">
                <div className="container mx-auto px-4 flex flex-col space-y-4">
                  <NavLinks />
                </div>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center space-x-2">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
