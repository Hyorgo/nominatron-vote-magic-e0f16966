interface ReservationHeaderProps {
  title: string;
  subtitle: string;
}

export const ReservationHeader = ({ title, subtitle }: ReservationHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 golden-reflection animate-fade-in">{title}</h1>
      <p className="text-xl sm:text-2xl text-gold/80 animate-fade-in delay-100 whitespace-nowrap">{subtitle}</p>
    </div>
  );
};