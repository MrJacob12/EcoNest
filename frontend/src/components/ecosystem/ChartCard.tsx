import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartCardProps {
  icon: ReactNode;
  title: string;
  data: any[];
  dataKey: string;
  stroke: string;
}

export const ChartCard = ({ icon, title, data, dataKey, stroke }: ChartCardProps) => {
  return (
    <Card className="p-6 bg-white/50">
      <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};