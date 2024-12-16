import { Button } from "../ui/button";

interface ShowMoreButtonProps {
  totalImages: number;
  showAll: boolean;
  onToggle: () => void;
  visibleCount: number;
}

const ShowMoreButton = ({ totalImages, showAll, onToggle, visibleCount }: ShowMoreButtonProps) => {
  if (totalImages <= visibleCount) return null;

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onToggle}
        className="mt-4 hover:scale-105 transition-transform"
      >
        {showAll ? "Show Less" : `Show ${totalImages - visibleCount} More`}
      </Button>
    </div>
  );
};

export default ShowMoreButton;