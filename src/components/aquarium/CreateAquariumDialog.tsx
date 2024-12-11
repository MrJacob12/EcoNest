import { useState } from "react";
import { Aquarium } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CreateAquariumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (aquarium: Aquarium) => void;
}

export const CreateAquariumDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateAquariumDialogProps) => {
  const [newAquarium, setNewAquarium] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = () => {
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

    onSubmit(aquarium);
    setNewAquarium({ name: "", description: "" });
    onOpenChange(false);
    toast.success("New aquarium added!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={handleSubmit} className="w-full">
            Add Aquarium
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};