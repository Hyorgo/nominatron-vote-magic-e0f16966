import React from "react";
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
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
];

export const VotesChart = ({ data }: VotesChartProps) => {
  return (
    <Card className="p-6 animate-fade-in delay-100">
      <h3 className="text-lg font-semibold mb-6 text-gold">
        Distribution des votes par catégorie
      </h3>
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
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--navy))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar 
              dataKey="votes" 
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              background={{ fill: "rgba(255, 255, 255, 0.05)" }}
            >
              {data.map((_, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="votes"
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};