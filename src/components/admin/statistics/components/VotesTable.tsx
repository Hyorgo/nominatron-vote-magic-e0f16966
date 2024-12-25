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
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Détails des votes par catégorie
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Catégorie</TableHead>
              <TableHead>Nominé</TableHead>
              <TableHead className="text-right">Votes</TableHead>
              <TableHead className="text-right">Pourcentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((category, categoryIndex) => (
              <>
                {categoryIndex > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="h-4 bg-navy/5" />
                    </TableCell>
                  </TableRow>
                )}
                {category.nominees.map((nominee, index) => (
                  <TableRow
                    key={`${category.categoryName}-${nominee.name}`}
                    className={categoryIndex % 2 === 0 ? "bg-navy/20" : "bg-navy/10"}
                  >
                    {index === 0 && (
                      <TableCell
                        rowSpan={category.nominees.length}
                        className="font-medium"
                      >
                        {category.categoryName}
                      </TableCell>
                    )}
                    <TableCell>{nominee.name}</TableCell>
                    <TableCell className="text-right">{nominee.votes}</TableCell>
                    <TableCell className="text-right">
                      {nominee.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};