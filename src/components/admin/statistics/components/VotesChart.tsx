import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VotesChartProps {
  data: {
    name: string;
    votes: number;
  }[];
}

const CHART_COLORS = [
  "#D946EF", // Magenta
  "#F97316", // Orange
  "#0EA5E9", // Bleu
  "#8B5CF6", // Violet
  "#c9a55c", // Or
  "#10B981", // Émeraude
];

export const VotesChart = ({ data }: VotesChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy/95 p-4 rounded-lg border border-gold/30 shadow-xl 
                      backdrop-blur-sm animate-scale-in">
          <p className="text-gold font-bold mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              {payload[0].value.toLocaleString()}
            </span>
            <span className="text-sm text-foreground/60">votes</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-navy/80 via-navy to-navy-dark 
                    border border-gold/20 hover:border-gold/30
                    transition-all duration-500 animate-fade-in">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#333" 
              opacity={0.1} 
              className="animate-fade-in [animation-delay:200ms]"
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#999' }}
              axisLine={{ stroke: '#333' }}
              tickLine={{ stroke: '#333' }}
              className="animate-fade-in [animation-delay:300ms]"
            />
            <YAxis 
              tick={{ fill: '#999' }}
              axisLine={{ stroke: '#333' }}
              tickLine={{ stroke: '#333' }}
              tickFormatter={(value) => value.toLocaleString()}
              className="animate-fade-in [animation-delay:400ms]"
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(201, 165, 92, 0.1)' }}
            />
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="votes"
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                radius={[4, 4, 0, 0]}
                className={`transition-all duration-300 hover:brightness-110 cursor-pointer
                          animate-fade-in`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};