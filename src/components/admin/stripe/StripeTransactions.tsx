import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripeTransactions } from "@/hooks/useStripeTransactions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

export const StripeTransactions = () => {
  const { transactions, loading } = useStripeTransactions();

  if (loading) {
    return <div>Chargement des transactions...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dernières transactions</h3>
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune transaction récente</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(transaction.created_at))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount / 100}€</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.status === 'succeeded' ? 'Réussi' : 'Échoué'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};