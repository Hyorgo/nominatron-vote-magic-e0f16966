const BokehEffect = () => {
  // Générer une taille aléatoire entre 20px et 250px pour plus de variation
  const getRandomSize = () => {
    return Math.floor(Math.random() * (250 - 20) + 20);
  };

  // Générer une position aléatoire autour d'un coin
  const getCornerPosition = (corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    const offset = Math.random() * 15; // Variation de position de 0-15%
    switch (corner) {
      case 'topLeft':
        return { top: `${offset}%`, left: `${offset}%` };
      case 'topRight':
        return { top: `${offset}%`, right: `${offset}%` };
      case 'bottomLeft':
        return { bottom: `${offset}%`, left: `${offset}%` };
      case 'bottomRight':
        return { bottom: `${offset}%`, right: `${offset}%` };
    }
  };

  // Créer les bokeh pour chaque coin
  const renderCornerBokeh = (corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    return [...Array(5)].map((_, i) => {
      const size = getRandomSize();
      const position = getCornerPosition(corner);
      return (
        <div 
          key={`${corner}-${i}`} 
          className={`bokeh-circle bokeh-${i % 3}`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            position: 'absolute',
            ...position
          }}
        />
      );
    });
  };

  return (
    <div className="bokeh-container">
      {/* Bokeh existants au centre */}
      {[...Array(20)].map((_, i) => {
        const size = getRandomSize();
        return (
          <div 
            key={`center-${i}`} 
            className={`bokeh-circle bokeh-${i % 3}`}
            style={{ 
              width: `${size}px`, 
              height: `${size}px` 
            }}
          />
        );
      })}
      
      {/* Bokeh dans les coins */}
      {renderCornerBokeh('topLeft')}
      {renderCornerBokeh('topRight')}
      {renderCornerBokeh('bottomLeft')}
      {renderCornerBokeh('bottomRight')}
    </div>
  );
};

export default BokehEffect;