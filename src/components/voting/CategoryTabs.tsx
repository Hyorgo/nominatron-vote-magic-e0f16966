import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/categories";
import { 
  UtensilsCrossed, 
  Wine, 
  Users, 
  Music, 
  Cake, 
  Croissant, 
  ShoppingBag, 
  UtensilsCrossed as RestaurantIcon, 
  Scissors, 
  Cigarette, 
  Pizza 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: Category[];
  currentCategory: string;
}

const getCategoryIcon = (categoryName: string) => {
  const icons: Record<string, JSX.Element> = {
    "Restaurant Festifs": <UtensilsCrossed className="h-4 w-4" />,
    "Bars": <Wine className="h-4 w-4" />,
    "Club de strip tease": <Users className="h-4 w-4" />,
    "Discotheques": <Music className="h-4 w-4" />,
    "Patissiers": <Cake className="h-4 w-4" />,
    "Boulangerie": <Croissant className="h-4 w-4" />,
    "Boutique": <ShoppingBag className="h-4 w-4" />,
    "Restaurant chinois": <RestaurantIcon className="h-4 w-4" />,
    "Coiffeurs": <Scissors className="h-4 w-4" />,
    "Tabacs": <Cigarette className="h-4 w-4" />,
    "Restaurant italien": <Pizza className="h-4 w-4" />,
  };
  return icons[categoryName] || <UtensilsCrossed className="h-4 w-4" />;
};

export const CategoryTabs = ({ categories, currentCategory }: CategoryTabsProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4 mb-8">
      <TabsList className="flex flex-wrap gap-2 justify-center h-auto p-2 bg-transparent">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className={cn(
              "min-w-[140px] h-16 flex-col gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "transition-all duration-200 hover:scale-105",
              "border border-border/50 shadow-sm",
              currentCategory === category.id && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {getCategoryIcon(category.name)}
            <span className="text-sm font-medium">{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};