import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, MessageSquare, Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png"
              alt="Lyon d'Or" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/reserver"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-primary transition-colors rounded-lg hover:bg-white/5"
            >
              <Book className="w-4 h-4" />
              Réserver ma place
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-primary transition-colors rounded-lg hover:bg-white/5"
            >
              <MessageSquare className="w-4 h-4" />
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link
                to="/reserver"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                <Book className="w-4 h-4" />
                Réserver ma place
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                <MessageSquare className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};