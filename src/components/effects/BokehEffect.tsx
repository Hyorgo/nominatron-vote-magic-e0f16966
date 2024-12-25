import { useEffect } from "react";
import "../../styles/bokeh.css";

export const BokehEffect = () => {
  useEffect(() => {
    const createBokeh = () => {
      const container = document.querySelector('.bokeh-container');
      if (!container) return;

      container.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        const bokeh = document.createElement('div');
        bokeh.className = 'bokeh';
        
        const size = Math.random() * 100 + 50;
        bokeh.style.width = `${size}px`;
        bokeh.style.height = `${size}px`;
        
        bokeh.style.left = `${Math.random() * 100}%`;
        bokeh.style.top = `${Math.random() * 100}%`;
        
        const colors = [
          'rgba(201, 165, 92, 0.15)', // Or
          'rgba(217, 70, 239, 0.15)', // Fuchsia
          'rgba(14, 165, 233, 0.15)', // Bleu
        ];
        bokeh.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        bokeh.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(bokeh);
      }
    };

    createBokeh();
    const interval = setInterval(createBokeh, 20000);

    return () => clearInterval(interval);
  }, []);

  return <div className="bokeh-container" />;
};