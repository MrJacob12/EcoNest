import { useEffect, useState } from "react";
import { AquariumImage } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Droplet, Thermometer, Fish, Sun, Leaf } from "lucide-react";
import { getAllImagesFromDb } from "@/utils/indexedDB";

interface ImageGalleryProps {
  onSelect: (image: AquariumImage) => void;
  selectedImage: AquariumImage | null;
  aquariumId: string;
  refreshTrigger?: number;
}

const ImageGallery = ({ onSelect, selectedImage, aquariumId, refreshTrigger }: ImageGalleryProps) => {
  const [images, setImages] = useState<AquariumImage[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getAllImagesFromDb()
      .then((allImages) => {
        const filteredImages = allImages.filter(
          (img) => img.aquariumId === aquariumId
        );
        setImages(filteredImages);
      })
      .catch(() => {
        console.error("Failed to load images from DB");
      });
  }, [aquariumId, refreshTrigger]);

  const displayedImages = showAll ? images : images.slice(0, 3);

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedImages
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((image, index) => (
            <Card
              key={image.id}
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in hover:scale-[1.02] ${
                selectedImage?.id === image.id ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelect(image)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={image.url}
                  alt={`Aquarium on ${image.date}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {image.title || "Aquarium Status"}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-medium">{image.date}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Analysis Status</span>
                    <div className="flex gap-2">
                      {image.analysis ? (
                        <>
                          <Droplet className="h-5 w-5 text-blue-500 hover:scale-110 transition-transform" />
                          <Thermometer className="h-5 w-5 text-red-500 hover:scale-110 transition-transform" />
                          <Fish className="h-5 w-5 text-primary hover:scale-110 transition-transform" />
                          <Sun className="h-5 w-5 text-yellow-500 hover:scale-110 transition-transform" />
                          <Leaf className="h-5 w-5 text-green-500 hover:scale-110 transition-transform" />
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">No analysis</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {images.length > 3 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 hover:scale-105 transition-transform"
          >
            {showAll ? "Show Less" : `Show ${images.length - 3} More`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;