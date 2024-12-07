import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trees } from "lucide-react";

interface EcosystemHeaderProps {
  name: string;
  type: string;
  isEditing: boolean;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
}

const EcosystemHeader = ({
  name,
  type,
  isEditing,
  onNameChange,
  onTypeChange,
}: EcosystemHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
      <div className="p-3 bg-primary-light/10 rounded-full">
        <Trees className="h-8 w-8 text-primary-light" />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-2xl font-bold"
          />
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">
            {name}
          </h1>
        )}

        {isEditing ? (
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full bg-background mt-2">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Terrarium">Terrarium</SelectItem>
              <SelectItem value="Aquarium">Aquarium</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-gray-600">{type}</p>
        )}
      </div>
    </div>
  );
};

export default EcosystemHeader;
