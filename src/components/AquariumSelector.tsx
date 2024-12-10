import { useState } from "react";
import { Aquarium } from "@/types";
import { Button } from "./ui/button";
import { PlusCircle, Settings2, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface AquariumSelectorProps {
  selectedAquarium: Aquarium | null;
  onSelect: (aquarium: Aquarium) => void;
}

export const AquariumSelector = ({
  selectedAquarium,
  onSelect,
}: AquariumSelectorProps) => {
  const [aquariums, setAquariums] = useState<Aquarium[]>(() => {
    const stored = localStorage.getItem("aquariums");
    return stored ? JSON.parse(stored) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [aquariumToDelete, setAquariumToDelete] = useState<Aquarium | null>(null);
  const [editingAquarium, setEditingAquarium] = useState<Aquarium | null>(null);
  const [newAquarium, setNewAquarium] = useState({
    name: "",
    description: "",
  });

  const handleAddAquarium = () => {
    if (!newAquarium.name.trim()) {
      toast.error("Please enter an aquarium name");
      return;
    }

    const aquarium: Aquarium = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAquarium.name.trim(),
      description: newAquarium.description.trim(),
      createdAt: new Date().toISOString(),
      settings: {
        showTemperature: true,
      },
    };

    const updatedAquariums = [...aquariums, aquarium];
    setAquariums(updatedAquariums);
    localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    setNewAquarium({ name: "", description: "" });
    setIsOpen(false);
    onSelect(aquarium);
    toast.success("New aquarium added!");
  };

  const handleEditAquarium = () => {
    if (!editingAquarium) return;

    const updatedAquariums = aquariums.map((aq) =>
      aq.id === editingAquarium.id ? editingAquarium : aq
    );
    setAquariums(updatedAquariums);
    localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    setIsEditOpen(false);
    onSelect(editingAquarium);
    toast.success("Aquarium updated successfully!");
  };

  const handleDeleteAquarium = (aquarium: Aquarium) => {
    setAquariumToDelete(aquarium);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!aquariumToDelete) return;

    const updatedAquariums = aquariums.filter((aq) => aq.id !== aquariumToDelete.id);
    setAquariums(updatedAquariums);
    localStorage.setItem("aquariums", JSON.stringify(updatedAquariums));
    
    if (selectedAquarium?.id === aquariumToDelete.id) {
      onSelect(updatedAquariums[0] || null);
    }
    
    setDeleteDialogOpen(false);
    setAquariumToDelete(null);
    toast.success("Aquarium deleted successfully");
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {selectedAquarium?.name || "Select Aquarium"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedAquarium?.description || "Choose or create an aquarium to manage"}
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Aquarium</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAquarium.name}
                  onChange={(e) =>
                    setNewAquarium((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Aquarium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAquarium.description}
                  onChange={(e) =>
                    setNewAquarium((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description of your aquarium"
                />
              </div>
              <Button onClick={handleAddAquarium} className="w-full">
                Add Aquarium
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {aquariums.map((aquarium) => (
          <div key={aquarium.id} className="flex items-center gap-2">
            <Button
              variant={selectedAquarium?.id === aquarium.id ? "default" : "outline"}
              onClick={() => onSelect(aquarium)}
              className="whitespace-nowrap"
            >
              {aquarium.name}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingAquarium(aquarium);
                    setIsEditOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteAquarium(aquarium)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Aquarium</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{aquariumToDelete?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
    </div>
  );
};