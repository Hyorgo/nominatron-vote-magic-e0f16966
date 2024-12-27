import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Création de site internet", url: "https://ideai.fr/creation-de-site-internet" },
    { name: "Référencement naturel (SEO)", url: "https://ideai.fr/referencement-naturel" },
    { name: "Référencement Local", url: "https://ideai.fr/seo-local" },
    { name: "Audit SEO", url: "https://ideai.fr/audit-seo" },
    { name: "Automatisations", url: "https://ideai.fr/" },
    { name: "Intelligence artificielle (AI)", url: "https://ideai.fr/" }
  ];

  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-gold/10 bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
          {/* Logo et message section */}
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center gap-6">
            <img 
              src="/lovable-uploads/780999f0-d95d-41a7-bc28-00565fb1cc46.png" 
              alt="ideAI Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
            />
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Dirigeants, propulsez votre entreprise en ligne
              </h3>
              <p className="text-sm sm:text-base golden-reflection">
                Transformez votre présence digitale en machine à croissance avec notre expertise en IA et marketing digital.
              </p>
            </div>
          </div>

          {/* Contact section */}
          <div className="flex flex-col items-center md:items-start text-white space-y-3">
            <h3 className="text-white font-semibold mb-2">Nos coordonnées</h3>
            <a 
              href="https://www.ideai.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors text-white text-sm sm:text-base"
            >
              www.ideai.fr
            </a>
            <a 
              href="tel:0451220225" 
              className="hover:text-gold transition-colors text-white text-sm sm:text-base"
            >
              04 51 22 02 25
            </a>
          </div>

          {/* Services section */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-white font-semibold mb-4">Nos services</h3>
            <ul className="text-center md:text-right text-white space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors text-sm sm:text-base"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-gold/90">
            <span>© {currentYear} ideAI. Tous droits réservés.</span>
            <span className="hidden sm:inline">•</span>
            <Link to="/mentions-legales" className="hover:text-gold transition-colors">
              Mentions légales
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/politique-de-confidentialite" className="hover:text-gold transition-colors">
              Politique de confidentialité
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};