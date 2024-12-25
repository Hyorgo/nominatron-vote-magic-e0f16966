import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Nominee {
  name: string;
  votes: number;
  percentage: number;
}

interface CategoryStats {
  categoryName: string;
  nominees: Nominee[];
}

interface VotesTableProps {
  statistics: CategoryStats[];
}

type SortField = "category" | "nominee" | "votes" | "percentage";
type SortDirection = "asc" | "desc";

export const VotesTable = ({ statistics }: VotesTableProps) => {
  const [sortField, setSortField] = useState<SortField>("category");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAndFilteredStats = React.useMemo(() => {
    let filteredStats = selectedCategory
      ? statistics.filter((cat) => cat.categoryName === selectedCategory)
      : statistics;

    return filteredStats.map((category) => ({
      ...category,
      nominees: [...category.nominees].sort((a, b) => {
        const compareValue = (aVal: any, bVal: any) =>
          sortDirection === "asc" ? aVal > bVal : aVal < bVal;

        switch (sortField) {
          case "nominee":
            return compareValue(a.name, b.name) ? 1 : -1;
          case "votes":
            return compareValue(a.votes, b.votes) ? 1 : -1;
          case "percentage":
            return compareValue(a.percentage, b.percentage) ? 1 : -1;
          default:
            return 0;
        }
      }),
    }));
  }, [statistics, sortField, sortDirection, selectedCategory]);

  const uniqueCategories = React.useMemo(
    () => ["Toutes les catégories", ...new Set(statistics.map((s) => s.categoryName))],
    [statistics]
  );

  return (
    <Card className="p-6 animate-fade-in delay-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gold">
          Détails des votes par catégorie
        </h3>
        <select
          className="bg-navy-light border border-border/20 rounded px-3 py-2 text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((category) => (
            <option key={category} value={category === "Toutes les catégories" ? "" : category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/20">
              <TableHead className="text-foreground/70">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("category")}
                  className="hover:text-gold"
                >
                  Catégorie
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-foreground/70">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("nominee")}
                  className="hover:text-gold"
                >
                  Nominé
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right text-foreground/70">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("votes")}
                  className="hover:text-gold"
                >
                  Votes
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right text-foreground/70">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("percentage")}
                  className="hover:text-gold"
                >
                  Pourcentage
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStats.map((category, categoryIndex) => (
              <React.Fragment key={category.categoryName}>
                {categoryIndex > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-2">
                      <div className="h-2" />
                    </TableCell>
                  </TableRow>
                )}
                {category.nominees.map((nominee, index) => (
                  <TableRow
                    key={`${category.categoryName}-${nominee.name}`}
                    className="hover:bg-navy-light/50 transition-colors"
                  >
                    {index === 0 && (
                      <TableCell
                        rowSpan={category.nominees.length}
                        className="font-medium text-gold/80"
                      >
                        {category.categoryName}
                      </TableCell>
                    )}
                    <TableCell>{nominee.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {nominee.votes}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {nominee.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};