import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/categories";

interface CategoryTabsProps {
  categories: Category[];
}

export const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  const midPoint = Math.ceil(categories.length / 2);
  const firstRow = categories.slice(0, midPoint);
  const secondRow = categories.slice(midPoint);

  return (
    <div className="space-y-2 mb-8">
      <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm">
        {firstRow.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm">
        {secondRow.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};