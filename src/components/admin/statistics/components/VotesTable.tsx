import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export const VotesTable = ({ statistics }: VotesTableProps) => {
  return (
    <Card className="p-6 animate-fade-in delay-200">
      <h3 className="text-lg font-semibold mb-6 text-gold">
        Détails des votes par catégorie
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/20">
              <TableHead className="text-foreground/70">Catégorie</TableHead>
              <TableHead className="text-foreground/70">Nominé</TableHead>
              <TableHead className="text-right text-foreground/70">Votes</TableHead>
              <TableHead className="text-right text-foreground/70">Pourcentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((category, categoryIndex) => (
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