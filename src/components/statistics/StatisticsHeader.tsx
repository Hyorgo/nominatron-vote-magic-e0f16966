import { Trophy } from "lucide-react";

interface StatisticsHeaderProps {
  title: string;
  subtitle: string;
}

export const StatisticsHeader = ({ title, subtitle }: StatisticsHeaderProps) => {
  return (
    <div className="text-center space-y-6 bg-navy/30 border border-gold/20 
                    p-8 rounded-2xl shadow-xl backdrop-blur-sm animate-fade-in">
      <div className="relative">
        <Trophy className="absolute -top-6 -left-6 h-12 w-12 text-gold animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-bold golden-reflection tracking-tight">
          {title}
        </h1>
        <Trophy className="absolute -top-6 -right-6 h-12 w-12 text-gold animate-pulse" />
      </div>
      <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms] 
                    max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};