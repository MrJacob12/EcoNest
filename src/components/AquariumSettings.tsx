import { Aquarium } from "@/types";
import { Button } from "./ui/button";
import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface AquariumSettingsProps {
  aquarium: Aquarium;
  onUpdate: (aquarium: Aquarium) => void;
}

const AquariumSettings = ({ aquarium, onUpdate }: AquariumSettingsProps) => {
  const handleToggleSection = (section: keyof Aquarium["settings"]) => {
    const updatedSettings = {
      ...aquarium.settings,
      [section]: !aquarium.settings?.[section],
    };

    onUpdate({
      ...aquarium,
      settings: updatedSettings,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="hover:scale-105 transition-transform"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="animate-fade-in">
        <DialogHeader>
          <DialogTitle>Aquarium Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
            <Label htmlFor="show-temperature">Temperature Section</Label>
            <Switch
              id="show-temperature"
              checked={aquarium.settings?.showTemperature}
              onCheckedChange={() => handleToggleSection("showTemperature")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AquariumSettings;