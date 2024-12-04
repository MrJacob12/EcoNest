import { StatisticCard } from "@/components/ecosystem/StatisticCard";
import {
  Droplets,
  ThermometerSun,
  Calendar,
  BarChart2,
  TrendingUp,
  BatteryCharging,
  Sun,
  Droplet,
} from "lucide-react";

interface EcosystemStatisticsProps {
  volume: string;
  temperature: string;
  lastChecked: string;
  ammonia?: string;
  nitrate?: string;
  nitrite?: string;
  hardness?: string;
  co2?: string;
  humidity: string;
  light?: string;
  soilMoisture?: string;
  onStatChange?: (key: string, value: string) => void;
  isEditing?: boolean;
}

const EcosystemStatistics = ({
  volume,
  temperature,
  lastChecked,
  ammonia,
  nitrate,
  nitrite,
  hardness,
  co2,
  humidity,
  light,
  soilMoisture,
  onStatChange,
  isEditing,
}: EcosystemStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      {/* Volume */}
      <StatisticCard
        icon={<Droplets className="h-5 w-5" />}
        title="Volume"
        suffix="L"
        value={`${volume}`}
        isEditing={isEditing}
        onValueChange={(value) => onStatChange?.("volume", value)}
      />

      {/* Temperature */}
      <StatisticCard
        icon={<ThermometerSun className="h-5 w-5" />}
        title="Temperature"
        suffix="°C"
        value={`${temperature}`}
        isEditing={isEditing}
        onValueChange={(value) => onStatChange?.("temperature", value)}
      />

      {/* Ammonia Levels (only for Aquarium) */}
      {ammonia && (
        <StatisticCard
          icon={<BarChart2 className="h-5 w-5" />}
          title="Ammonia Levels"
          suffix="ppm"
          value={`${ammonia}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("ammonia", value)}
        />
      )}

      {/* Nitrate Levels (only for Aquarium) */}
      {nitrate && (
        <StatisticCard
          icon={<BarChart2 className="h-5 w-5" />}
          title="Nitrate Levels"
          suffix="ppm"
          value={`${nitrate}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("nitrate", value)}
        />
      )}

      {/* Nitrite Levels (only for Aquarium) */}
      {nitrite && (
        <StatisticCard
          icon={<BarChart2 className="h-5 w-5" />}
          title="Nitrite Levels"
          suffix="ppm"
          value={`${nitrite}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("nitrite", value)}
        />
      )}

      {/* Water Hardness (only for Aquarium) */}
      {hardness && (
        <StatisticCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Water Hardness (GH)"
          suffix="dGH"
          value={`${hardness}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("hardness", value)}
        />
      )}

      {/* CO2 Levels (only for Aquarium) */}
      {co2 && (
        <StatisticCard
          icon={<BatteryCharging className="h-5 w-5" />}
          title="CO2 Levels"
          suffix="mg/L"
          value={`${co2}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("co2", value)}
        />
      )}

      {/* Humidity */}
      <StatisticCard
        icon={<Droplets className="h-5 w-5" />}
        title="Humidity"
        suffix="%"
        value={`${humidity}`}
        isEditing={isEditing}
        onValueChange={(value) => onStatChange?.("humidity", value)}
      />

      {/* Light (only for Terrarium) */}
      {light && (
        <StatisticCard
          icon={<Sun className="h-5 w-5" />}
          title="Light"
          suffix="lux"
          value={`${light}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("light", value)}
        />
      )}

      {/* Soil Moisture (only for Terrarium) */}
      {soilMoisture && (
        <StatisticCard
          icon={<Droplet className="h-5 w-5" />}
          title="Soil Moisture"
          suffix="%"
          value={`${soilMoisture}`}
          isEditing={isEditing}
          onValueChange={(value) => onStatChange?.("soilMoisture", value)}
        />
      )}

      {/* Last Checked */}
      <StatisticCard
        icon={<Calendar className="h-5 w-5" />}
        title="Last Checked"
        value={`${lastChecked}`}
        isEditing={isEditing}
        onValueChange={(value) => onStatChange?.("lastChecked", value)}
      />
    </div>
  );
};

export default EcosystemStatistics;
