import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryLeader {
  nominee_name: string;
  category_name: string;
  vote_count: number;
}

interface CategoryLeadersSectionProps {
  leaders: CategoryLeader[];
}

export const CategoryLeadersSection = ({ leaders }: CategoryLeadersSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8 bg-navy/30 p-4 rounded-lg 
                    border border-gold/20 backdrop-blur-sm animate-fade-in">
        <Award className="h-8 w-8 text-gold animate-pulse" />
        <div>
          <h2 className="text-2xl font-semibold golden-reflection">
            Leaders par Catégorie
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Les nominés en tête dans chaque catégorie
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader, index) => (
          <Card key={leader.category_name}
                className="group p-6 bg-navy/30 hover:bg-navy/40
                         border border-gold/10 hover:border-gold/30
                         transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                         backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}>
            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground group-hover:text-muted-foreground/80">
                {leader.category_name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gold group-hover:text-gold-light 
                           transition-colors">
                  {leader.nominee_name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-gold/90 group-hover:text-gold transition-colors">
                    {leader.vote_count.toLocaleString()} votes
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