import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EcosystemActionsProps {
  isEditing: boolean;
  onEditSaveToggle: () => void;
}

const EcosystemActions = ({
  isEditing,
  onEditSaveToggle,
}: EcosystemActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="hover:bg-primary-light/10 w-full md:w-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ecosystems
      </Button>
      <Button
        variant="outline"
        onClick={onEditSaveToggle}
        className="hover:bg-primary-light/10 w-full md:w-auto"
      >
        {isEditing ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        ) : (
          <>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Ecosystem
          </>
        )}
      </Button>
    </div>
  );
};

export default EcosystemActions;
