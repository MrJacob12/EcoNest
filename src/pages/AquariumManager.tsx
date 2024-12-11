import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Aquarium, AquariumImage } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings2, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ImageGallery from "@/components/ImageGallery";
import TemperatureSection from "@/components/TemperatureSection";
import AquariumSettings from "@/components/AquariumSettings";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AquariumManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aquarium, setAquarium] = useState<Aquarium | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedImage, setSelectedImage] = useState<AquariumImage | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAquarium, setEditingAquarium] = useState<Aquarium | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("aquariums");
    if (stored) {
      const aquariums: Aquarium[] = JSON.parse(stored);
      const found = aquariums.find((aq) => aq.id === id);
      if (found) {
        setAquarium(found);
        setEditingAquarium(found);
      } else {
        toast.error("Aquarium not found");
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handleUpdateAquarium = (updatedAquarium: Aquarium) => {
    setAquarium(updatedAquarium);
    const stored = localStorage.getItem("aquariums");
    if (stored) {
      const aquariums = JSON.parse(stored);
      const updatedAquariums = aquariums.map((aq: Aquarium) =>
        aq.id === updatedAquarium.id ? updatedAquarium : aq
      );
      localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    }
  };

  const handleImageSelect = (image: AquariumImage) => {
    setSelectedImage(image);
    navigate(`/image/${image.id}`);
  };

  const handleEditAquarium = () => {
    if (!editingAquarium) return;
    handleUpdateAquarium(editingAquarium);
    setIsEditOpen(false);
    toast.success("Aquarium updated successfully!");
  };

  const handleDeleteAquarium = () => {
    if (!aquarium) return;
    
    const stored = localStorage.getItem("aquariums");
    if (stored) {
      const aquariums = JSON.parse(stored);
      const updatedAquariums = aquariums.filter((aq: Aquarium) => aq.id !== aquarium.id);
      localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
      
      // Also delete all images associated with this aquarium
      const storedImages = localStorage.getItem("images");
      if (storedImages) {
        const images = JSON.parse(storedImages);
        const updatedImages = images.filter((img: AquariumImage) => img.aquariumId !== aquarium.id);
        localStorage.setItem("images", JSON.stringify(updatedImages));
      }
      
      toast.success("Aquarium deleted successfully");
      navigate("/");
    }
  };

  if (!aquarium) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <div className="container py-8 space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold text-primary tracking-tight">
                {aquarium.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Aquarium</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Aquarium</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editingAquarium?.name || ""}
                        onChange={(e) =>
                          setEditingAquarium((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editingAquarium?.description || ""}
                        onChange={(e) =>
                          setEditingAquarium((prev) =>
                            prev ? { ...prev, description: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <Button onClick={handleEditAquarium} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Aquarium</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to delete "{aquarium.name}"? This action cannot be undone and will delete all associated images.</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAquarium}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AquariumSettings
                aquarium={aquarium}
                onUpdate={handleUpdateAquarium}
              />
            </div>
          </div>

          {aquarium.settings?.showTemperature && (
            <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <TemperatureSection aquariumId={aquarium.id} />
            </div>
          )}

          <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
            <ImageUpload
              onUpload={() => setRefreshTrigger((prev) => prev + 1)}
              aquariumId={aquarium.id}
            />
          </div>

          <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <ImageGallery
              aquariumId={aquarium.id}
              refreshTrigger={refreshTrigger}
              onSelect={handleImageSelect}
              selectedImage={selectedImage}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AquariumManager;