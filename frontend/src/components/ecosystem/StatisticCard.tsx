import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StatisticCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  suffix?: string;
  isEditing?: boolean;
  onValueChange?: (value: string) => void;
}

export const StatisticCard = ({
  icon,
  title,
  value,
  suffix,
  isEditing,
  onValueChange,
}: StatisticCardProps) => {
  return (
    <Card className="bg-white/50 p-6 rounded-lg border border-gray-100">
      {isEditing ? (
        <>
          <Label className="text-primary-dark font-semibold mb-2">
            {title}
          </Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="text-xl font-semibold w-full"
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">{icon}</div>
            <h3 className="font-semibold text-primary-dark">{title}</h3>
          </div>
          <p className="text-gray-600">
            {value}
            {suffix ? suffix : null}
          </p>
        </>
      )}
    </Card>
  );
};
