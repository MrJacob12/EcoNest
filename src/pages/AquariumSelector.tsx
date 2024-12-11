import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Aquarium } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateAquariumDialog } from "@/components/aquarium/CreateAquariumDialog";
import { AquariumCard } from "@/components/aquarium/AquariumCard";
import Footer from "@/components/Footer";

const AquariumSelector = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [aquariums, setAquariums] = useState<Aquarium[]>(() => {
    const stored = localStorage.getItem("aquariums");
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();

  const handleAquariumSelect = (aquarium: Aquarium) => {
    navigate(`/aquarium/${aquarium.id}`);
  };

  const handleAquariumCreate = (newAquarium: Aquarium) => {
    const updatedAquariums = [...aquariums, newAquarium];
    setAquariums(updatedAquariums);
    localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    navigate(`/aquarium/${newAquarium.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container py-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              AquaTracker
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aquariums.map((aquarium) => (
              <AquariumCard
                key={aquarium.id}
                aquarium={aquarium}
                onClick={() => handleAquariumSelect(aquarium)}
              />
            ))}
          </div>

          {aquariums.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Create your first aquarium to start tracking
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CreateAquariumDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleAquariumCreate}
      />
    </div>
  );
};

export default AquariumSelector;