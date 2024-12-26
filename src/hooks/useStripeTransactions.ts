import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
}

export const useStripeTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_transactions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading };
};