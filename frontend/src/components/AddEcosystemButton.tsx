import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddEcosystemButtonProps {
  onClick: () => void;
}

export const AddEcosystemButton = ({ onClick }: AddEcosystemButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-full h-[200px] border-2 border-dashed border-primary/20 bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
    >
      <div className="flex flex-col items-center gap-2">
        <Plus className="h-8 w-8 text-primary" />
        <span className="text-primary font-medium">Add New Ecosystem</span>
      </div>
    </Button>
  );
};