import { Button } from "@/components/ui/button";
import { Heart, User, Shield, Menu } from "lucide-react"; // ✅ Removed Link icon to avoid name clash
import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Correct Link for routing

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
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
            <a href="#" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
            <Link to="/login/doctor" className="text-foreground hover:text-primary transition-colors">Doctor</Link>
            <Link to="/login/patient" className="text-foreground hover:text-primary transition-colors">Patient</Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Emergency</a>
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
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-3 pt-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
              <Link to="/login/doctor" className="text-foreground hover:text-primary transition-colors">Doctor Login</Link>
              <Link to="/login/patient" className="text-foreground hover:text-primary transition-colors">Patient Login</Link>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Emergency</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
