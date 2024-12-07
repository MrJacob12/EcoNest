import { ReactNode } from "react";
import { cn } from "@/lib/utils";
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
    <Card className={cn(
        "p-6 cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in",
        "backdrop-blur-sm bg-card/80 border border-gray-200"
      )}>
      {isEditing ? (
        <>
          <Label className="text-primary-dark font-semibold mb-2">
            {title} {suffix}
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
