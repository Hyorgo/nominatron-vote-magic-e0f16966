import { Trophy, Award, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TopNominee {
  nominee_name: string;
  category_name: string;
  vote_count: number;
}

interface TopNomineesSectionProps {
  topNominees: TopNominee[];
}

export const TopNomineesSection = ({ topNominees }: TopNomineesSectionProps) => {
  const getRandomIcon = (index: number) => {
    const icons = [
      <Trophy className="h-8 w-8 text-gold animate-pulse" />,
      <Award className="h-8 w-8 text-gold/90 animate-pulse" />,
      <Star className="h-8 w-8 text-gold/80 animate-pulse" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8 bg-navy/30 p-4 rounded-lg 
                    border border-gold/20 backdrop-blur-sm animate-fade-in">
        <Trophy className="h-8 w-8 text-gold animate-pulse" />
        <div>
          <h2 className="text-2xl font-semibold golden-reflection">
            Top 5 - Toutes Catégories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Les nominés les plus plébiscités toutes catégories confondues
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topNominees.map((nominee, index) => (
          <Card key={nominee.nominee_name}
                className="group p-6 bg-navy/30 hover:bg-navy/40
                         border border-gold/10 hover:border-gold/30
                         transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                         animate-fade-in backdrop-blur-sm"
                style={{ animationDelay: `${index * 150}ms` }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-navy/20 group-hover:bg-navy/30 rounded-full
                           transition-colors">
                {getRandomIcon(index)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gold group-hover:text-gold-light 
                             transition-colors">
                  {nominee.nominee_name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                  {nominee.category_name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium text-gold/90 group-hover:text-gold transition-colors">
                    {nominee.vote_count.toLocaleString()} votes
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};