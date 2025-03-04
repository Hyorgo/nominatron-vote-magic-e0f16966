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

interface SearchAndSortBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "name" | "date";
  onSortChange: (value: "name" | "date") => void;
}

export const SearchAndSortBar = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: SearchAndSortBarProps) => {
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
      <Select
        value={sortOrder}
        onValueChange={(value: "name" | "date") => onSortChange(value)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choisir l'ordre de tri</p>
          </TooltipContent>
        </Tooltip>
        <SelectContent>
          <SelectItem value="name">Trier par nom</SelectItem>
          <SelectItem value="date">Trier par date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};