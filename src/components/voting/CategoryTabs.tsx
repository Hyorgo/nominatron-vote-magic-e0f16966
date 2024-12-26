import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/categories";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CategoryTabsProps {
  categories: Category[];
  currentCategory: string;
  selectedNominees?: Record<string, string>;
}

export const CategoryTabs = ({ categories, currentCategory, selectedNominees = {} }: CategoryTabsProps) => (
  <div className="w-full overflow-x-auto pb-4 mb-8">
    <TabsList className="flex flex-wrap gap-2 justify-center h-auto p-2 bg-transparent">
      {categories.map((category) => {
        const hasVoted = selectedNominees[category.id];
        
        return (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className={cn(
              "relative min-w-[140px] h-16 flex items-center justify-center gap-2",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "transition-all duration-200 hover:scale-105",
              "border border-border/50 shadow-sm",
              currentCategory === category.id && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <span className="text-sm font-medium">{category.name}</span>
            {hasVoted && (
              <Check 
                className={cn(
                  "h-4 w-4",
                  "text-emerald-500",
                  "animate-in fade-in duration-300"
                )} 
              />
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  </div>
);