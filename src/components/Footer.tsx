const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-4 mt-auto border-t border-gold/10 bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <div className="container mx-auto">
        <div className="flex justify-start items-center">
          <img 
            src="/lovable-uploads/780999f0-d95d-41a7-bc28-00565fb1cc46.png" 
            alt="ideAI Logo" 
            className="h-20 w-20 object-contain"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-2 text-sm text-gold/90">
        <span>© {currentYear} ideAI. Tous droits réservés.</span>
        <span className="hidden sm:inline">•</span>
        <a href="#" className="hover:text-gold transition-colors">
          Mentions légales
        </a>
        <span className="hidden sm:inline">•</span>
        <a href="#" className="hover:text-gold transition-colors">
          Politique de confidentialité
        </a>
        <span className="hidden sm:inline">•</span>
        <a href="#" className="hover:text-gold transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;