import { ChartCard } from "@/components/ecosystem/ChartCard";
import { Activity, Droplets } from "lucide-react";

interface EcosystemHistoryChartsProps {
  history: {
    date: string;
    temperature: number;
    humidity: number;
    ph?: number;
  }[];
  type: string;
}

const EcosystemHistoryCharts = ({
  history,
  type,
}: EcosystemHistoryChartsProps) => {
  return (
    <div className="space-y-6">
      <ChartCard
        icon={<Activity className="h-5 w-5" />}
        title="Temperature History"
        data={history}
        dataKey="temperature"
        stroke="#354F52"
      />

      <ChartCard
        icon={<Droplets className="h-5 w-5" />}
        title="Humidity History"
        data={history}
        dataKey="humidity"
        stroke="#84A98C"
      />

      {(type === "Aquarium" || type === "Paludarium") && (
        <ChartCard
          icon={<Activity className="h-5 w-5" />}
          title="pH History"
          data={history}
          dataKey="ph"
          stroke="#2F3E46"
        />
      )}
    </div>
  );
};

export default EcosystemHistoryCharts;
