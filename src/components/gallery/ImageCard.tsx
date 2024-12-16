import { AquariumImage } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Droplet, Thermometer, Fish, Sun, Leaf, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ImageCardProps {
  image: AquariumImage;
  isSelected: boolean;
  onClick: (image: AquariumImage) => void;
  index: number;
  onSelectForAnalysis?: (image: AquariumImage, selected: boolean) => void;
  isSelectedForAnalysis?: boolean;
  showAnalysisSelection?: boolean;
  onDelete?: (image: AquariumImage) => void;
}

const ImageCard = ({ 
  image, 
  isSelected, 
  onClick, 
  index,
  onSelectForAnalysis,
  isSelectedForAnalysis,
  showAnalysisSelection = false,
  onDelete,
}: ImageCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(image);
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in relative ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(image)}
    >
      {showAnalysisSelection && (
        <div 
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSelectForAnalysis?.(image, !isSelectedForAnalysis);
          }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-md hover:bg-white transition-colors duration-200">
            <Checkbox
              checked={isSelectedForAnalysis}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </div>
        </div>
      )}

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
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this image? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
  );
};

export default ImageCard;