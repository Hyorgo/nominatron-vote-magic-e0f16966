import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchSortBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "name" | "date";
  onSortChange: (value: "name" | "date") => void;
}

export const SearchSortBar = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: SearchSortBarProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un nominé..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select value={sortOrder} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Trier par nom</SelectItem>
                  <SelectItem value="date">Trier par date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sélectionnez un critère de tri</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};