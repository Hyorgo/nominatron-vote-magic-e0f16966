import { Link } from "react-router-dom";
import { Ticket, MessageSquare } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 right-0 bg-background border-t border-border md:hidden">
      <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        <Link
          to="/reserver"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
        >
          <Ticket className="w-5 h-5" />
          <span>Réserver ma place</span>
        </Link>
        <Link
          to="/contact"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Contact</span>
        </Link>
      </div>
    </div>
  );
};