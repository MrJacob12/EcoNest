import { Aquarium } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

interface AquariumCardProps {
  aquarium: Aquarium;
  onClick: () => void;
}

export const AquariumCard = ({ aquarium, onClick }: AquariumCardProps) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{aquarium.name}</CardTitle>
        <CardDescription>
          {aquarium.description || "No description"}
          <div className="text-xs text-muted-foreground mt-2">
            Created {format(new Date(aquarium.createdAt), "PPP")}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};