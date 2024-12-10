import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import { useNavigate } from "react-router-dom";
import { AquariumImage, Aquarium } from "@/types";
import { AquariumSelector } from "@/components/AquariumSelector";
import TemperatureSection from "@/components/TemperatureSection";
import AquariumSettings from "@/components/AquariumSettings";
import Footer from "@/components/Footer";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<AquariumImage | null>(null);
  const [selectedAquarium, setSelectedAquarium] = useState<Aquarium | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const handleImageClick = (image: AquariumImage) => {
    navigate(`/image/${image.id}`);
  };

  const handleImageUpload = (newImage: AquariumImage) => {
    if (!selectedAquarium) return;
    setSelectedImage(newImage);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateAquarium = (updatedAquarium: Aquarium) => {
    setSelectedAquarium(updatedAquarium);
    const stored = localStorage.getItem("aquariums");
    if (stored) {
      const aquariums = JSON.parse(stored);
      const updatedAquariums = aquariums.map((aq: Aquarium) =>
        aq.id === updatedAquarium.id ? updatedAquarium : aq
      );
      localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container py-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary tracking-tight animate-fade-in">
              AquaTracker
            </h1>
            {selectedAquarium && (
              <AquariumSettings
                aquarium={selectedAquarium}
                onUpdate={handleUpdateAquarium}
              />
            )}
          </div>
          
          <AquariumSelector
            selectedAquarium={selectedAquarium}
            onSelect={setSelectedAquarium}
          />
          
          {selectedAquarium ? (
            <div className="space-y-8 animate-fade-in">
              {selectedAquarium.settings?.showTemperature && (
                <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <TemperatureSection aquariumId={selectedAquarium.id} />
                </div>
              )}
              
              <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
                <ImageUpload 
                  onUpload={handleImageUpload} 
                  aquariumId={selectedAquarium.id} 
                />
              </div>
              
              <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                <ImageGallery
                  onSelect={handleImageClick}
                  selectedImage={selectedImage}
                  aquariumId={selectedAquarium.id}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              Please select or create an aquarium to start tracking
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;