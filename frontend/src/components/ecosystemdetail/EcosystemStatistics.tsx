import { StatisticCard } from "@/components/ecosystem/StatisticCard";
import { Droplets, ThermometerSun, Calendar } from "lucide-react";

interface EcosystemStatisticsProps {
  volume: string;
  temperature: string;
  lastChecked: string;
}

const EcosystemStatistics = ({
  volume,
  temperature,
  lastChecked,
}: EcosystemStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      <StatisticCard
        icon={<Droplets className="h-5 w-5" />}
        title="Volume"
        value={volume}
      />
      <StatisticCard
        icon={<ThermometerSun className="h-5 w-5" />}
        title="Temperature"
        value={temperature}
      />
      <StatisticCard
        icon={<Calendar className="h-5 w-5" />}
        title="Last Check"
        value={lastChecked}
      />
    </div>
  );
};

export default EcosystemStatistics;
