const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 mt-auto bg-navy/80 backdrop-blur-sm border-t border-gold/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/780999f0-d95d-41a7-bc28-00565fb1cc46.png" 
              alt="ideAI Logo" 
              className="h-16 w-16 object-contain" // Augmentation de la taille de 12 à 16
            />
            <div className="text-sm text-gold/90">
              © {currentYear} Nominatron. Tous droits réservés.
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gold/90 hover:text-gold transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-sm text-gold/90 hover:text-gold transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-sm text-gold/90 hover:text-gold transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;