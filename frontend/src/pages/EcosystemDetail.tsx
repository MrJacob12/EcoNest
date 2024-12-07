import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import EcosystemActions from "@/components/ecosystemdetail/EcosystemActions";
import EcosystemHeader from "@/components/ecosystemdetail/EcosystemHeader";
import EcosystemStatistics from "@/components/ecosystemdetail/EcosystemStatistics";
import { EcosystemStats, EcosystemHistory } from "@/types";

const EcosystemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ecosystem, setEcosystem] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEcosystem, setEditedEcosystem] = useState<any | null>(null);
  const [ecosystemStats, setEcosystemStats] = useState<EcosystemStats>({
    volume: "10",
    temperature: "23",
    lastChecked: "2024-01-01",
    ammonia: "0.5",
    nitrate: "10",
    nitrite: "0.1",
    hardness: "8",
    co2: "10",
    humidity: "65",
    light: "1000",
    soilMoisture: "50",
  });

  useEffect(() => {
    const savedEcosystems = localStorage.getItem("ecosystems");
    if (savedEcosystems) {
      const ecosystems = JSON.parse(savedEcosystems);
      const found = ecosystems.find((eco) => eco.id === id);

      if (found) {
        if (!Array.isArray(found.history)) {
          found.history = [];
        }

        const latestHistory = found.history.length > 0 ? found.history[found.history.length - 1] : null;

        if (latestHistory) {
          setEcosystem(found);
          setEditedEcosystem(found);
          setEcosystemStats(latestHistory.stats);
        } else {
          setEcosystem(found);
          setEditedEcosystem(found);
          setEcosystemStats({
            volume: found.volume || "10",
            temperature: found.temperature || "23",
            lastChecked: new Date().toLocaleString(),
            ammonia: found.ammonia || "0",
            nitrate: found.nitrate || "0",
            nitrite: found.nitrite || "0",
            hardness: found.hardness || "0",
            co2: found.co2 || "0",
            humidity: found.humidity || "50",
          });
        }
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

    const updatedStats = {
      ...ecosystemStats,
      lastChecked: new Date().toLocaleString(),
    };

    const updatedHistory: EcosystemHistory = {
      date: new Date().toLocaleString(),
      stats: updatedStats,
    };

    const updatedEcosystem = {
      ...editedEcosystem,
      history: editedEcosystem.history ? [...editedEcosystem.history, updatedHistory] : [updatedHistory],
    };

    const savedEcosystems = localStorage.getItem("ecosystems");
    if (savedEcosystems) {
      const ecosystems = JSON.parse(savedEcosystems);
      const updatedEcosystems = ecosystems.map((eco) =>
        eco.id === id ? updatedEcosystem : eco
      );
      localStorage.setItem("ecosystems", JSON.stringify(updatedEcosystems));
      setEcosystem(updatedEcosystem);
      setEditedEcosystem(updatedEcosystem);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Ecosystem updated successfully!",
      });
    }
  };

  const handleStatChange = (key: string, value: string) => {
    setEcosystemStats((prevStats) => ({
      ...prevStats,
      [key]: value,
    }));
  };

  if (!ecosystem || !editedEcosystem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
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

        <EcosystemStatistics
          volume={ecosystemStats.volume}
          temperature={ecosystemStats.temperature}
          lastChecked={ecosystemStats.lastChecked}
          ammonia={ecosystemStats.ammonia}
          nitrate={ecosystemStats.nitrate}
          nitrite={ecosystemStats.nitrite}
          hardness={ecosystemStats.hardness}
          co2={ecosystemStats.co2}
          humidity={ecosystemStats.humidity}
          light={ecosystemStats.light}
          soilMoisture={ecosystemStats.soilMoisture}
          type={ecosystem.type}
          onStatChange={handleStatChange}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default EcosystemDetail;
