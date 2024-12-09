import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AquariumImage } from "@/types";
import { toast } from "sonner";
import { saveImageToDb } from "@/utils/indexedDB";

interface ImageUploadProps {
  onUpload: (image: AquariumImage) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newImage: AquariumImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            date: new Date().toISOString().split("T")[0],
            description: "",
          };

          // Zapisz obraz w IndexedDB
          saveImageToDb(newImage)
            .then(() => {
              onUpload(newImage); // Przekaż obraz do rodzica
              toast.success("Image uploaded successfully!");
            })
            .catch(() => toast.error("Failed to save image"));
        };
        reader.readAsDataURL(file);
      });
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl text-primary">📸</div>
        {isDragActive ? (
          <p className="text-primary">Drop your aquarium photos here...</p>
        ) : (
          <p className="text-gray-600">
            Drag & drop aquarium photos here, or click to select
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
