import { useState, useEffect } from "react";
import { EcosystemCard } from "@/components/EcosystemCard";
import { NewEcosystemDialog } from "@/components/ecosystem/NewEcosystemDialog";

interface Ecosystem {
  id: string;
  name: string;
  type: string;
  volume: string;
  lastChecked: string;
}

const Index = () => {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);

  useEffect(() => {
    const savedEcosystems = localStorage.getItem("ecosystems");
    if (savedEcosystems) {
      setEcosystems(JSON.parse(savedEcosystems));
    }
  }, []);

  const handleAddEcosystem = (ecosystem: Ecosystem) => {
    const updatedEcosystems = [...ecosystems, ecosystem];
    setEcosystems(updatedEcosystems);
    localStorage.setItem("ecosystems", JSON.stringify(updatedEcosystems));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-dark">
              My Ecosystems
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your biological ecosystems
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystems.map((ecosystem) => (
            <EcosystemCard
              key={ecosystem.id}
              id={ecosystem.id}
              name={ecosystem.name}
              type={ecosystem.type}
              volume={ecosystem.volume}
              lastChecked={ecosystem.lastChecked}
            />
          ))}
          <NewEcosystemDialog onAddEcosystem={handleAddEcosystem} />
        </div>
      </div>
    </div>
  );
};

export default Index;
