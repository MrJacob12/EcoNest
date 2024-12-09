import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import SettingsModal from "@/components/SettingsModal";
import { useNavigate } from "react-router-dom";
import { AquariumImage } from "@/types";
import { saveImageToDb } from "@/utils/indexedDB";

const Index = () => {
  const [images, setImages] = useState<AquariumImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<AquariumImage | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (images.length > 0) {
      images.forEach((image) => {
        saveImageToDb(image).catch(() => console.error("Failed to save image"));
      });
    }
  }, [images]);

  const handleImageUpload = (newImage: AquariumImage) => {
    setImages((prev) => [...prev, newImage]);
  };

  const handleImageClick = (image: AquariumImage) => {
    navigate(`/image/${image.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 relative animate-fade-in">
        <SettingsModal />
        <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">
          Aquarium Tracker
        </h1>
        <ImageUpload onUpload={handleImageUpload} />
        <ImageGallery
          onSelect={handleImageClick}
          selectedImage={selectedImage}
        />
      </div>
    </div>
  );
};

export default Index;
