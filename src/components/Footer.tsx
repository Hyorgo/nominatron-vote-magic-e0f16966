const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Création de site internet",
    "Référencement naturel (SEO)",
    "Référencement Local",
    "Audit SEO",
    "Automatisations",
    "Intelligence artificielle (AI)"
  ];

  return (
    <footer className="w-full py-4 px-4 mt-auto border-t border-gold/10 bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo section */}
          <div className="flex justify-start items-center">
            <img 
              src="/lovable-uploads/780999f0-d95d-41a7-bc28-00565fb1cc46.png" 
              alt="ideAI Logo" 
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Contact section */}
          <div className="flex flex-col items-center justify-center text-gold/90 space-y-2">
            <a 
              href="https://www.ideai.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              www.ideai.fr
            </a>
            <a 
              href="tel:0451220225" 
              className="hover:text-gold transition-colors"
            >
              04 51 22 02 25
            </a>
          </div>

          {/* Services section */}
          <div className="flex flex-col items-end">
            <h3 className="text-gold mb-2 font-semibold">Nos services</h3>
            <ul className="text-right text-gold/90">
              {services.map((service, index) => (
                <li key={index} className="mb-1">{service}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-sm text-gold/90">
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