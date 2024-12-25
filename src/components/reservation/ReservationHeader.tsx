interface ReservationHeaderProps {
  title: string;
  subtitle: string;
}

export const ReservationHeader = ({ title, subtitle }: ReservationHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-3 golden-reflection">{title}</h1>
      <p className="text-gold/80">{subtitle}</p>
    </div>
  );
};