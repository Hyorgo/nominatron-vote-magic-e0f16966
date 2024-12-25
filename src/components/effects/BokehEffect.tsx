const BokehEffect = () => {
  // Générer une taille aléatoire entre 20px et 250px pour plus de variation
  const getRandomSize = () => {
    return Math.floor(Math.random() * (250 - 20) + 20);
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