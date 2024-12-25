import { HomeHero } from "@/components/home/HomeHero";
import { ActionCards } from "@/components/home/ActionCards";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Création des éléments bokeh
    const createBokeh = () => {
      const container = document.querySelector('.bokeh-container');
      if (!container) return;

      // Nettoyer les anciens éléments
      container.innerHTML = '';

      // Créer de nouveaux éléments bokeh
      for (let i = 0; i < 20; i++) {
        const bokeh = document.createElement('div');
        bokeh.className = 'bokeh';
        
        // Taille aléatoire
        const size = Math.random() * 100 + 50;
        bokeh.style.width = `${size}px`;
        bokeh.style.height = `${size}px`;
        
        // Position aléatoire
        bokeh.style.left = `${Math.random() * 100}%`;
        bokeh.style.top = `${Math.random() * 100}%`;
        
        // Couleur aléatoire
        const colors = [
          'rgba(201, 165, 92, 0.15)', // Or
          'rgba(217, 70, 239, 0.15)', // Fuchsia
          'rgba(14, 165, 233, 0.15)', // Bleu
        ];
        bokeh.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Délai d'animation aléatoire
        bokeh.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(bokeh);
      }
    };

    createBokeh();
    
    // Recréer les éléments bokeh toutes les 20 secondes pour maintenir l'effet
    const interval = setInterval(createBokeh, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bokeh-container" />
      <div className="container py-16 space-y-16">
        <HomeHero />
        <ActionCards />
      </div>
    </div>
  );
};

export default Index;