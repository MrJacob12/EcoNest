import { Card } from "@/components/ui/card";
import { Trees, Droplets, ThermometerSun, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface EcosystemCardProps {
  id: string;
  name: string;
  type: string;
  volume: string;
  lastChecked: string;
}

export const EcosystemCard = ({
  id,
  name,
  type,
  volume,
  lastChecked,
}: EcosystemCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in",
        "backdrop-blur-sm bg-card/80 border border-gray-200"
      )}
      onClick={() => navigate(`/ecosystem/${id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-light/10 rounded-full">
            <Trees className="h-6 w-6 text-primary-light" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary-dark">{name}</h3>
            <p className="text-sm text-gray-600">{type}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          <span className="text-sm text-gray-600">{volume}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-4 w-4 text-primary" />
          <span className="text-sm text-gray-600">23°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm text-gray-600">Last check: {lastChecked}</span>
        </div>
      </div>
    </Card>
  );
};