import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Politique de Confidentialité</h1>
        
        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Collecte des informations</h2>
          <p>Nous collectons des informations lorsque vous :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Réservez des billets pour nos événements</li>
            <li>Participez aux votes</li>
            <li>Nous contactez via le formulaire de contact</li>
          </ul>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Utilisation des informations</h2>
          <p>Les informations que nous collectons sont utilisées pour :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gérer vos réservations et vous envoyer les confirmations</li>
            <li>Vous permettre de participer aux votes</li>
            <li>Vous contacter en cas de besoin concernant nos services</li>
            <li>Améliorer votre expérience utilisateur</li>
          </ul>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Protection des informations</h2>
          <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.</p>
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

export default PrivacyPolicy;