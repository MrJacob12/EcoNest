import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

interface TemperatureData {
  date: string;
  value: number;
}

interface TemperatureSectionProps {
  aquariumId: string;
}

const TemperatureSection = ({ aquariumId }: TemperatureSectionProps) => {
  const [temperature, setTemperature] = useState("");
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>(() => {
    const stored = localStorage.getItem(`temperature-${aquariumId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const handleAddTemperature = () => {
    if (!temperature || isNaN(Number(temperature))) {
      toast.error("Please enter a valid temperature");
      return;
    }

    const newData = [
      ...temperatureData,
      {
        date: new Date().toISOString(),
        value: Number(temperature),
      },
    ];

    setTemperatureData(newData);
    localStorage.setItem(`temperature-${aquariumId}`, JSON.stringify(newData));
    setTemperature("");
    toast.success("Temperature recorded successfully!");
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border animate-fade-in">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Enter temperature..."
          />
        </div>
        <Button onClick={handleAddTemperature}>Record</Button>
      </div>

      {temperatureData.length > 0 && (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleString()}
                formatter={(value) => [`${value}°C`, "Temperature"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TemperatureSection;