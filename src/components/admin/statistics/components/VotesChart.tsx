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
  "#c9a55c", // Gold
  "#D946EF", // Magenta
  "#0EA5E9", // Blue
  "#F97316", // Orange
  "#10B981", // Emerald
  "#F59E0B", // Amber
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
        <div className="bg-navy p-3 rounded-lg border border-gold/20 shadow-xl">
          <p className="text-gold font-medium mb-1">{label}</p>
          <p className="text-sm text-foreground">
            {payload[0].value} votes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-navy/50 backdrop-blur-sm">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#999' }}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#999' }}
              axisLine={{ stroke: '#333' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="votes"
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                radius={[4, 4, 0, 0]}
                className="transition-opacity duration-300"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};