import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  onSearch: (query: string) => void;
}

export function AdminSearch({ onSearch }: AdminSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Rechercher..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}