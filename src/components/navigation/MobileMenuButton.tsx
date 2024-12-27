import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button 
      className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-white" />
      ) : (
        <Menu className="h-6 w-6 text-white" />
      )}
    </button>
  );
};