import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoricalData {
  nominee_name: string | null;
  category_name: string | null;
  vote_count: number | null;
  date: string | null;
  time: string | null;
}

export const VotingHistoryChart = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const { data: historyData, error } = await supabase
        .from('vote_history_view')
        .select('nominee_name, category_name, vote_count, date, time');

      if (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        return;
      }

      setHistoricalData(historyData || []);
    };

    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Prepare data for the chart
  const chartData = historicalData.reduce<Record<string, any>[]>((acc, curr) => {
    if (!curr.date || !curr.time) return acc;
    
    const date = format(
      new Date(`${curr.date} ${curr.time}`),
      'dd/MM HH:mm',
      { locale: fr }
    );
    
    const existingData = acc.find(d => d.date === date);
    
    if (existingData && curr.nominee_name) {
      existingData[curr.nominee_name] = curr.vote_count;
    } else if (curr.nominee_name) {
      acc.push({
        date,
        [curr.nominee_name]: curr.vote_count,
      });
    }
    
    return acc;
  }, []);

  // Get unique nominee names for creating chart lines
  const nominees = Array.from(
    new Set(historicalData.map(d => d.nominee_name).filter(Boolean))
  );

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Historique des Votes</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#888888' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fill: '#888888' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1b1e',
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
            {nominees.map((nominee, index) => (
              nominee && (
                <Line
                  key={nominee}
                  type="monotone"
                  dataKey={nominee}
                  name={nominee}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};