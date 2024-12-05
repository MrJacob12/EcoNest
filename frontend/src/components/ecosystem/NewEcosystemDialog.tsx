import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AddEcosystemButton } from "@/components/AddEcosystemButton"; // Reusing your custom button

interface Ecosystem {
  id: string;
  name: string;
  type: string;
  volume: string;
  lastChecked: string;
}

interface NewEcosystemDialogProps {
  onAddEcosystem: (ecosystem: Ecosystem) => void;
}

export const NewEcosystemDialog = ({
  onAddEcosystem,
}: NewEcosystemDialogProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEcosystem, setNewEcosystem] = useState({
    name: "",
    type: "",
    volume: "",
  });

  const handleAddEcosystem = () => {
    if (
      !newEcosystem.name ||
      !newEcosystem.type ||
      !newEcosystem.volume ||
      parseFloat(newEcosystem.volume) <= 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid data",
        variant: "destructive",
      });
      return;
    }

    const ecosystem: Ecosystem = {
      id: crypto.randomUUID(),
      name: newEcosystem.name,
      type: newEcosystem.type,
      volume: `${newEcosystem.volume}`,
      lastChecked: new Date().toLocaleDateString(),
    };

    onAddEcosystem(ecosystem);

    setNewEcosystem({ name: "", type: "", volume: "" });
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: "New ecosystem added successfully!",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div>
          <AddEcosystemButton onClick={() => setIsDialogOpen(true)} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Ecosystem</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newEcosystem.name}
              onChange={(e) =>
                setNewEcosystem({ ...newEcosystem, name: e.target.value })
              }
              placeholder="Tropical Terrarium"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={newEcosystem.type}
              onValueChange={(value) =>
                setNewEcosystem({ ...newEcosystem, type: value })
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Closed Terrarium">
                  Closed Terrarium
                </SelectItem>
                <SelectItem value="Open Terrarium">Open Terrarium</SelectItem>
                <SelectItem value="Aquarium">Aquarium</SelectItem>
                <SelectItem value="Paludarium">Paludarium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="volume">Volume (L)</Label>
            <Input
              id="volume"
              type="number"
              value={newEcosystem.volume}
              onChange={(e) =>
                setNewEcosystem({
                  ...newEcosystem,
                  volume: e.target.value,
                })
              }
              placeholder="2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddEcosystem}>Add Ecosystem</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
