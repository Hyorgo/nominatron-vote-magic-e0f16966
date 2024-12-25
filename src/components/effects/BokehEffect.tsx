const BokehEffect = () => {
  return (
    <div className="bokeh-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`bokeh-circle bokeh-${i % 3}`} />
      ))}
    </div>
  );
};

export default BokehEffect;