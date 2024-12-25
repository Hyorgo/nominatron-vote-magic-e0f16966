const BokehEffect = () => {
  // Générer une taille aléatoire entre 40px et 160px
  const getRandomSize = () => {
    return Math.floor(Math.random() * (160 - 40) + 40);
  };

  return (
    <div className="bokeh-container">
      {[...Array(20)].map((_, i) => {
        const size = getRandomSize();
        return (
          <div 
            key={i} 
            className={`bokeh-circle bokeh-${i % 3}`}
            style={{ 
              width: `${size}px`, 
              height: `${size}px` 
            }}
          />
        );
      })}
    </div>
  );
};

export default BokehEffect;