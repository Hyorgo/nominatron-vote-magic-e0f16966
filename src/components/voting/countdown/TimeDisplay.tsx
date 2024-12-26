interface TimeDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimeDisplay = ({ days, hours, minutes, seconds }: TimeDisplayProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-primary">{days}</span>
        <span className="text-sm text-muted-foreground">Jours</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-primary">{hours}</span>
        <span className="text-sm text-muted-foreground">Heures</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-primary">{minutes}</span>
        <span className="text-sm text-muted-foreground">Minutes</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-primary">{seconds}</span>
        <span className="text-sm text-muted-foreground">Secondes</span>
      </div>
    </div>
  );
};