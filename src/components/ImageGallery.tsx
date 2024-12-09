import { useEffect, useState } from "react";
import { AquariumImage } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Droplet, Thermometer, Fish, Sun, Leaf } from "lucide-react";
import { getAllImagesFromDb } from "@/utils/indexedDB"; // Import funkcji do pobierania obrazów z IndexedDB

interface ImageGalleryProps {
  onSelect: (image: AquariumImage) => void;
  selectedImage: AquariumImage | null;
}

const ImageGallery = ({ onSelect, selectedImage }: ImageGalleryProps) => {
  const [images, setImages] = useState<AquariumImage[]>([]);

  useEffect(() => {
    // Ładowanie obrazów z IndexedDB przy pierwszym renderze
    getAllImagesFromDb()
      .then(setImages) // Ustawienie pobranych obrazów w stanie
      .catch(() => {
        console.error("Failed to load images from DB");
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sortowanie po dacie
        .map((image) => (
          <Card
            key={image.id}
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in overflow-hidden ${
              selectedImage?.id === image.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(image)} // Kliknięcie na obraz
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={image.url}
                alt={`Aquarium on ${image.date}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">
                  {image.title ? image.title : "Aquarium Status"}
                </h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="font-medium">{image.date}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Analysis Status</span>
                  <div className="flex gap-2">
                    {image.analysis ? (
                      <>
                        <Droplet className="h-5 w-5 text-blue-500" />
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <Fish className="h-5 w-5 text-primary" />
                        <Sun className="h-5 w-5 text-yellow-500" />
                        <Leaf className="h-5 w-5 text-green-500" />
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">No analysis</span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 line-clamp-2"></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ImageGallery;
