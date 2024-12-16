import { useEffect, useState } from "react";
import { AquariumImage } from "@/types";
import { getAllImagesFromDb, saveImageToDb } from "@/utils/indexedDB";
import ImageCard from "./gallery/ImageCard";
import ShowMoreButton from "./gallery/ShowMoreButton";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ImageGalleryProps {
  onSelect: (image: AquariumImage) => void;
  selectedImage: AquariumImage | null;
  aquariumId: string;
  refreshTrigger?: number;
}

const ImageGallery = ({
  onSelect,
  selectedImage,
  aquariumId,
  refreshTrigger,
}: ImageGalleryProps) => {
  const [images, setImages] = useState<AquariumImage[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [selectedForAnalysis, setSelectedForAnalysis] = useState<string[]>([]);
  const VISIBLE_COUNT = 3;

  useEffect(() => {
    getAllImagesFromDb()
      .then((allImages) => {
        const filteredImages = allImages
          .filter((img) => img.aquariumId === aquariumId)
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
        setImages(filteredImages);
      })
      .catch(() => {
        console.error("Failed to load images from DB");
      });
  }, [aquariumId, refreshTrigger]);

  const handleDeleteImage = async (imageToDelete: AquariumImage) => {
    try {
      // Get all images
      const allImages = await getAllImagesFromDb();
      // Filter out the deleted image
      const updatedImages = allImages.filter(img => img.id !== imageToDelete.id);
      
      // Save the updated list back to IndexedDB
      for (const img of updatedImages) {
        await saveImageToDb(img);
      }
      
      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const displayedImages = showAll ? images : images.slice(0, VISIBLE_COUNT);

  const handleSelectForAnalysis = (image: AquariumImage, selected: boolean) => {
    setSelectedForAnalysis(prev => 
      selected 
        ? [...prev, image.id]
        : prev.filter(id => id !== image.id)
    );
  };

  const generateBatchAnalysisPrompt = () => {
    const selectedImages = images.filter(img => selectedForAnalysis.includes(img.id));
    const prompt = `I will now share ${selectedImages.length} aquarium images for analysis. Please analyze each image focusing on:
1. Water clarity and quality
2. Plant health and growth
3. Overall aquarium condition
4. Any visible issues or concerns

Please provide a separate analysis for each image, clearly labeled, and then a summary of overall trends or patterns you notice across all images. Format your response in markdown.

Please analyze these images in chronological order:

${selectedImages
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map((img, index) => `Image ${index + 1} - Date: ${img.date}`)
  .join('\n')}`;

    return prompt;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generateBatchAnalysisPrompt());
    toast.success("Analysis prompt copied to clipboard!");
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <div className="flex gap-2">
          <Button
            variant={isAnalysisMode ? "default" : "outline"}
            onClick={() => {
              setIsAnalysisMode(!isAnalysisMode);
              setSelectedForAnalysis([]);
            }}
            className="animate-fade-in"
          >
            {isAnalysisMode ? "Cancel Selection" : "Select for Analysis"}
          </Button>
          
          {isAnalysisMode && selectedForAnalysis.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="animate-scale-in">
                  Analyze {selectedForAnalysis.length} Images
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Batch Analysis Instructions</DialogTitle>
                  <DialogDescription>
                    Follow these steps to analyze your selected images:
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-4">
                    <div className="prose prose-sm">
                      <h3>Steps:</h3>
                      <ol>
                        <li>Copy the generated prompt below</li>
                        <li>Visit <a href="https://chat.openai.com" target="_blank" className="text-primary hover:underline">ChatGPT</a> or <a href="https://copilot.microsoft.com" target="_blank" className="text-primary hover:underline">Microsoft Copilot</a></li>
                        <li>Upload all selected images</li>
                        <li>Paste the prompt</li>
                        <li>Copy the analysis back to each image's details page</li>
                      </ol>
                    </div>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                        {generateBatchAnalysisPrompt()}
                      </pre>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={copyPrompt}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedImages.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImage?.id === image.id}
            onClick={onSelect}
            index={index}
            showAnalysisSelection={isAnalysisMode}
            isSelectedForAnalysis={selectedForAnalysis.includes(image.id)}
            onSelectForAnalysis={handleSelectForAnalysis}
            onDelete={handleDeleteImage}
          />
        ))}
      </div>
      
      <ShowMoreButton
        totalImages={images.length}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
        visibleCount={VISIBLE_COUNT}
      />
    </div>
  );
};

export default ImageGallery;
