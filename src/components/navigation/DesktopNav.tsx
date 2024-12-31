import { Link } from "react-router-dom";
import { Ticket, MessageSquare } from "lucide-react";

export const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link
        to="/reserver"
        className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
      >
        <Ticket className="w-5 h-5" />
        <span>Réserver ma place</span>
      </Link>
      <Link
        to="/contact"
        className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Contact</span>
      </Link>
    </div>
  );
};