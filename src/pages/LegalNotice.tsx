import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LegalNotice = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mentions Légales</h1>
        
        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Édition et publication du site</h2>
          <p>Société de conseil et gestion et bilan retraite à Lyon</p>
          <p>Nom de la société : Sortir-Lyon</p>
          <p>Statut juridique : SAS au capital de 5.000 €</p>
          <p>Numéro d'immatriculation au RCS : Lyon B 934 391 913</p>
          <p>Numéro de TVA intracommunautaire : FR45394391123</p>
          <p>Siège social : 10-12 BD Vivier Merle, 69003 Lyon, France</p>
          <p>Téléphone : +33 4 51 22 02 25</p>
          <p>Adresse email : contact@sortir-lyon.com</p>
          <p>Directeur de la publication : Adrien SAVOYE – Sortir-Lyon</p>
          <p>En charge de la rédaction : Adrien SAVOYE – Sortir-Lyon</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Conception et développement</h2>
          <p>Société ideAI – Création de sites web et référencement naturel.</p>
          <p>Site web : www.ideai.fr</p>
          <p>Téléphone : 04 51 22 02 25 – Mail : contact@ideai.fr</p>
          <p>Numéro Siret : RCS Lyon 934 391 913</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">Hébergement</h2>
          <p>Hébergeur : O2switch</p>
          <p>Adresse : Chemin des Pardiaux, 63.000 Clermont-Ferrand, France</p>
          <p>Téléphone : 04 44 44 60 40</p>
          <p>Adresse email : support@o2switch.fr</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">1. Conditions d'utilisation</h2>
          <p>L'accès et l'utilisation du site www.sortir-lyon.com sont soumis aux conditions générales d'utilisation décrites ci-après. En utilisant le site, vous reconnaissez avoir pris connaissance de ces conditions et les acceptez. ideAI se réserve le droit de les modifier à tout moment sans préavis.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">2. Limitation de responsabilité</h2>
          <p>Les informations fournies sur ce site sont réputées fiables. Toutefois, ideAI décline toute responsabilité en cas d'erreurs ou d'omissions dans les contenus diffusés. Les informations fournies sont sujettes à modification sans préavis et n'ont aucune valeur contractuelle. La société ideAI ne peut être tenue responsable de tout dommage direct ou indirect résultant de l'utilisation des informations et contenus du site.</p>
          <p>Les liens hypertextes présents sur le site qui redirigent vers d'autres ressources sur Internet ne sont pas sous le contrôle d'ideAI. Par conséquent, ideAI ne peut être tenue responsable de leur contenu, de leurs éventuelles modifications ou de leur dysfonctionnement.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">3. Propriété intellectuelle</h2>
          <p>L'ensemble des éléments figurant sur le site, incluant les textes, logos, graphismes, images, vidéos, ainsi que leur disposition, sont protégés par les lois en vigueur sur la propriété intellectuelle. Toute reproduction ou représentation totale ou partielle de ce site, par quelque procédé que ce soit, sans autorisation expresse de ideAI, est interdite et constituerait une contrefaçon. Les marques et logos utilisés sont la propriété d'ideAI et ne peuvent être utilisés sans autorisation préalable.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">4. Gestion des données personnelles</h2>
          <p>Conformément à la réglementation sur la protection des données, notamment le Règlement Général sur la Protection des Données (RGPD), www.sortir-lyon.com s'engage à garantir la confidentialité des données personnelles collectées par le biais de ce site. Pour toute question ou demande de suppression de vos données, vous pouvez nous contacter à l'adresse email : contact@sortir-lyon.com.</p>
          <p>Les informations recueillies à partir des formulaires présents sur le site sont destinées exclusivement à www.sortir-lyon.com et ne sont en aucun cas cédées à des tiers, sauf obligation légale. Vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données vous concernant.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">5. Utilisation des cookies</h2>
          <p>Le site www.sortir-lyon.com utilise des cookies pour optimiser votre expérience de navigation. Les cookies sont de petits fichiers textes placés sur votre appareil pour conserver des informations. En utilisant notre site, vous acceptez l'utilisation des cookies. Vous pouvez à tout moment désactiver les cookies depuis les paramètres de votre navigateur.</p>
          <p>Pour en savoir plus sur notre politique de confidentialité et notre politique de cookies, veuillez consulter les sections correspondantes disponibles sur notre site.</p>
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