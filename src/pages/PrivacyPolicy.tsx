import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Politique de Confidentialité</h1>
        
        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">1. Informations sur le Responsable de Traitement</h2>
          <p>
            Le site www.lyon-dor.fr est édité par la société ideAI, SAS au capital de 1 000 €, immatriculée au RCS de Lyon sous le numéro Lyon 934 391 913, dont le siège social est situé au 332, rue de la république, 69124 Colombier Saugnieu, France.
          </p>
          <p>
            Le Responsable de publication est Georges SAUVAT, joignable par e-mail à contact@ideai.fr ou par téléphone au +33 4 51 22 02 25.
          </p>
          <p>
            Le site est conçu par la société ideAI, création de sites internet et référencement naturel, et hébergé par o2switch, Chemin des Pardiaux, 63000 Clermont-Ferrand, France.
          </p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">2. Données Collectées</h2>
          <p>Le site www.lyon-dor.fr collecte des données personnelles par divers moyens :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Formulaire de contact : nom, prénom, email, numéro de téléphone, et message.</li>
            <li>Formulaire de demande de devis : nom, prénom, email, numéro de téléphone, code postal, et détails de la demande.</li>
            <li>Inscription à la newsletter : adresse email.</li>
            <li>Formulaire de rappel : numéro de téléphone.</li>
          </ul>
          <p>Ces données sont collectées exclusivement dans le cadre de votre interaction avec Lyon-dor pour vous fournir des informations sur nos services et vous proposer des offres adaptées à vos besoins.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">3. Finalités des Données Collectées</h2>
          <p>Les données recueillies sur le site www.lyon-dor.fr sont utilisées dans les objectifs suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Réponse aux demandes : les informations collectées via les formulaires de contact et de devis permettent de traiter vos requêtes et de vous recontacter selon vos préférences (téléphone ou email).</li>
            <li>Envoi de communications commerciales : sous réserve de votre consentement, nous pouvons vous envoyer des offres promotionnelles et actualités.</li>
            <li>Inscription à la Newsletter : pour vous transmettre des informations régulières sur les services proposés par Lyon-dor.</li>
          </ul>
          <p>Les données sont traitées par nos équipes internes et ne sont accessibles qu'aux collaborateurs habilités.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">4. Durée de Conservation des Données</h2>
          <p>Lyon-dor conserve vos données personnelles uniquement pour la durée nécessaire à leur traitement :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Données de contact et de devis : conservées pendant une durée maximale de 3 ans après la dernière interaction.</li>
            <li>Données de la newsletter : conservées jusqu'à désinscription.</li>
            <li>Données spécifiques : conservées en fonction des obligations légales applicables ou de l'activité pour laquelle elles ont été collectées.</li>
          </ul>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">5. Vos Droits Concernant Vos Données</h2>
          <p>Conformément à la législation en vigueur et notamment au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Droit d'accès : pour obtenir une copie de vos données personnelles traitées par Lyon-dor.</li>
            <li>Droit de rectification : pour corriger vos informations personnelles.</li>
            <li>Droit à l'effacement : pour demander la suppression de vos données, sauf si leur traitement est justifié par des obligations légales.</li>
            <li>Droit à la limitation du traitement : pour restreindre temporairement l'utilisation de vos données.</li>
            <li>Droit à la portabilité : pour recevoir vos données dans un format lisible, ou les transférer à un autre responsable de traitement.</li>
          </ul>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">6. Sécurité des Données</h2>
          <p>
            Lyon-dor met en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données personnelles. Les données sont protégées contre tout accès non autorisé, perte, altération ou divulgation. Seuls les collaborateurs habilités peuvent y accéder dans le cadre de leurs missions.
          </p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">7. Partage des Données avec des Tiers</h2>
          <p>Les données personnelles collectées par Lyon-dor ne sont pas partagées avec des tiers, sauf dans les cas suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Prestataires de services : pour l'envoi des newsletters, des offres ou d'autres services spécifiques, sous réserve de la confidentialité.</li>
            <li>Obligations légales : lorsque la loi exige la divulgation de vos informations.</li>
          </ul>
          <p>Lyon-dor s'engage à ne pas vendre, échanger ou transférer vos données personnelles sans votre consentement.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">8. Utilisation des Cookies</h2>
          <p>Le site www.lyon-dor.fr utilise des cookies pour optimiser votre expérience utilisateur et analyser la performance du site. Les cookies peuvent inclure les outils suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Analytics : pour recueillir des statistiques de visites et analyser l'usage des pages.</li>
            <li>Cookies de session : pour simplifier la navigation et conserver vos préférences.</li>
          </ul>
          <p>Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies. Toutefois, notez que certains cookies sont essentiels au bon fonctionnement du site. En refusant les cookies, certaines fonctionnalités peuvent être limitées.</p>
        </section>

        <section className="space-y-4 text-white/90">
          <h2 className="text-xl font-semibold text-white">9. Modifications de la Politique de Confidentialité</h2>
          <p>
            Lyon-dor se réserve le droit de modifier cette politique de confidentialité pour refléter les évolutions légales ou techniques. Nous vous invitons à consulter cette page régulièrement pour vous tenir informé de tout changement. La date de la dernière mise à jour est indiquée en haut de cette page.
          </p>
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