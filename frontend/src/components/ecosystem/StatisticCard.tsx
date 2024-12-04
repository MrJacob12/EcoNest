import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatisticCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  isEditing?: boolean;
  onValueChange?: (value: string) => void;
}

export const StatisticCard = ({
  icon,
  title,
  value,
  isEditing,
  onValueChange,
}: StatisticCardProps) => {
  return (
    <Card className="bg-white/50 p-6 rounded-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold text-primary-dark">{title}</h3>
      </div>
      <p className="text-gray-600">{value}</p>
    </Card>
  );
};