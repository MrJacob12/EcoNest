import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import EcosystemHeader from "@/components/ecosystemdetail/EcosystemHeader";
import EcosystemStatistics from "@/components/ecosystemdetail/EcosystemStatistics";
import EcosystemHistoryCharts from "@/components/ecosystemdetail/EcosystemHistoryCharts";
import EcosystemActions from "@/components/ecosystemdetail/EcosystemActions";

// Ecosystem data interface
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
  const [editedEcosystem, setEditedEcosystem] = useState<Ecosystem | null>(
    null
  );

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
    return null; // Optionally add a loading spinner or message while waiting for data
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Ecosystem Actions (Back and Edit/Save Button) */}
        <EcosystemActions
          isEditing={isEditing}
          onEditSaveToggle={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        />

        {/* Ecosystem Header */}
        <EcosystemHeader
          name={ecosystem.name}
          type={ecosystem.type}
          isEditing={isEditing}
          onNameChange={(name) =>
            setEditedEcosystem({ ...editedEcosystem, name })
          }
          onTypeChange={(type) =>
            setEditedEcosystem({ ...editedEcosystem, type })
          }
        />

        {/* Ecosystem Statistics */}
        <EcosystemStatistics
          volume={ecosystem.volume}
          temperature="23°C" // This could be dynamic based on ecosystem data
          lastChecked={ecosystem.lastChecked}
        />

        {/* Ecosystem History Charts */}
        {/* <EcosystemHistoryCharts
          history={ecosystem.history}
          type={ecosystem.type}
        /> */}
      </div>
    </div>
  );
};

export default EcosystemDetail;
