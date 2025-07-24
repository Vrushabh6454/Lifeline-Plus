import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Lifeline Plus</h1>
              <p className="text-xs text-muted-foreground">AI Healthcare Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/register/doctor" className="text-foreground hover:text-primary transition-colors">Doctor</Link>
            <Link to="/register/patient" className="text-foreground hover:text-primary transition-colors">Patient</Link>
            <Link to="/emergency" className="text-foreground hover:text-primary transition-colors">Emergency</Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
  <div className="absolute top-full left-0 w-full bg-background border-t border-border z-50 shadow-md md:hidden">
    <nav className="flex flex-col space-y-3 px-4 py-4">
      <Link
        to="/"
        onClick={() => setIsMenuOpen(false)}
        className="text-foreground hover:text-primary transition-colors"
      >
        Dashboard
      </Link>
      <Link
        to="/register/doctor"
        onClick={() => setIsMenuOpen(false)}
        className="text-foreground hover:text-primary transition-colors"
      >
        Doctor
      </Link>
      <Link
        to="/register/patient"
        onClick={() => setIsMenuOpen(false)}
        className="text-foreground hover:text-primary transition-colors"
      >
        Patient
      </Link>
      <Link
        to="/emergency"
        onClick={() => setIsMenuOpen(false)}
        className="text-foreground hover:text-primary transition-colors"
      >
        Emergency
      </Link>
    </nav>
  </div>
)}

      </div>
    </header>
  );
};

export default Header;
