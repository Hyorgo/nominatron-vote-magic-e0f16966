import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LegalNotice = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mentions Légales</h1>
        
        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Éditeur du site</h2>
          <p>ideAI</p>
          <p>Adresse : [Votre adresse]</p>
          <p>Téléphone : 04 51 22 02 25</p>
          <p>Email : contact@ideai.fr</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Hébergement</h2>
          <p>Ce site est hébergé par :</p>
          <p>[Nom de l'hébergeur]</p>
          <p>[Adresse de l'hébergeur]</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Propriété intellectuelle</h2>
          <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
        </section>

        <div className="pt-8">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;