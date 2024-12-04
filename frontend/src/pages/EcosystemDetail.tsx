import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Droplets,
  ThermometerSun,
  Calendar,
  Trees,
  Edit2,
  Save,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { StatisticCard } from "@/components/ecosystem/StatisticCard";
import { ChartCard } from "@/components/ecosystem/ChartCard";

interface Ecosystem {
  id: string;
  name: string;
  type: string;
  volume: string;
  lastChecked: string;
  history?: {
    date: string;
    temperature: number;
    humidity: number;
    ph?: number;
  }[];
}

const mockHistory = [
  { date: "2024-01", temperature: 23, humidity: 75, ph: 6.8 },
  { date: "2024-02", temperature: 24, humidity: 78, ph: 6.9 },
  { date: "2024-03", temperature: 22, humidity: 72, ph: 6.7 },
];

const EcosystemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEcosystem, setEditedEcosystem] = useState<Ecosystem | null>(null);

  useEffect(() => {
    const savedEcosystems = localStorage.getItem("ecosystems");
    if (savedEcosystems) {
      const ecosystems: Ecosystem[] = JSON.parse(savedEcosystems);
      const found = ecosystems.find((eco) => eco.id === id);
      if (found) {
        const ecosystemWithHistory = {
          ...found,
          history: found.history || mockHistory,
        };
        setEcosystem(ecosystemWithHistory);
        setEditedEcosystem(ecosystemWithHistory);
      } else {
        toast({
          title: "Error",
          description: "Ecosystem not found",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [id, navigate, toast]);

  const handleSave = () => {
    if (!editedEcosystem) return;

    const savedEcosystems = localStorage.getItem("ecosystems");
    if (savedEcosystems) {
      const ecosystems: Ecosystem[] = JSON.parse(savedEcosystems);
      const updatedEcosystems = ecosystems.map((eco) =>
        eco.id === id ? editedEcosystem : eco
      );
      localStorage.setItem("ecosystems", JSON.stringify(updatedEcosystems));
      setEcosystem(editedEcosystem);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Ecosystem updated successfully!",
      });
    }
  };

  if (!ecosystem || !editedEcosystem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="hover:bg-primary-light/10 w-full md:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ecosystems
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="hover:bg-primary-light/10 w-full md:w-auto"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Ecosystem
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-4 md:p-8 bg-card/80 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
              <div className="p-3 bg-primary-light/10 rounded-full">
                <Trees className="h-8 w-8 text-primary-light" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedEcosystem.name}
                    onChange={(e) =>
                      setEditedEcosystem({ ...editedEcosystem, name: e.target.value })
                    }
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">
                    {ecosystem.name}
                  </h1>
                )}
                {isEditing ? (
                  <Select
                    value={editedEcosystem.type}
                    onValueChange={(value) =>
                      setEditedEcosystem({ ...editedEcosystem, type: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-background mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="Closed Terrarium">Closed Terrarium</SelectItem>
                      <SelectItem value="Open Terrarium">Open Terrarium</SelectItem>
                      <SelectItem value="Aquarium">Aquarium</SelectItem>
                      <SelectItem value="Paludarium">Paludarium</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-600">{ecosystem.type}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <StatisticCard
                icon={<Droplets className="h-5 w-5" />}
                title="Volume"
                value={ecosystem.volume}
              />
              <StatisticCard
                icon={<ThermometerSun className="h-5 w-5" />}
                title="Temperature"
                value="23°C"
              />
              <StatisticCard
                icon={<Calendar className="h-5 w-5" />}
                title="Last Check"
                value={ecosystem.lastChecked}
              />
            </div>

            <div className="space-y-6">
              <ChartCard
                icon={<Activity className="h-5 w-5" />}
                title="Temperature History"
                data={ecosystem.history}
                dataKey="temperature"
                stroke="#354F52"
              />

              <ChartCard
                icon={<Droplets className="h-5 w-5" />}
                title="Humidity History"
                data={ecosystem.history}
                dataKey="humidity"
                stroke="#84A98C"
              />

              {(ecosystem.type === "Aquarium" || ecosystem.type === "Paludarium") && (
                <ChartCard
                  icon={<Activity className="h-5 w-5" />}
                  title="pH History"
                  data={ecosystem.history}
                  dataKey="ph"
                  stroke="#2F3E46"
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EcosystemDetail;