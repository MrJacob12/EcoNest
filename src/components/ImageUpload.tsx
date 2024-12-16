import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AquariumImage, GlobalSettings } from "@/types";
import { toast } from "sonner";
import { saveImageToDb } from "@/utils/indexedDB";

interface ImageUploadProps {
  onUpload: (image: AquariumImage) => void;
  aquariumId: string;
}

const SETTINGS_KEY = "global_settings";

interface DiscordResponse {
  attachments?: Array<{
    proxy_url?: string;
  }>;
}

const ImageUpload = ({ onUpload, aquariumId }: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!aquariumId) {
        toast.error("Please select an aquarium first");
        return;
      }

      const settings = localStorage.getItem(SETTINGS_KEY);
      const webhookUrl = settings ? JSON.parse(settings).webhookUrl : null;

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newImage: AquariumImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            date: new Date().toISOString().split("T")[0],
            description: "",
            aquariumId: aquariumId,
          };

          // If webhook is configured, try to get proxy URL first
          if (webhookUrl) {
            const formData = new FormData();
            formData.append(
              "payload_json",
              JSON.stringify({
                content: `New aquarium image uploaded on ${newImage.date}`,
              })
            );
            formData.append("file", file);

            fetch(webhookUrl, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data: DiscordResponse) => {
                // If we got a proxy URL from Discord, use it instead
                if (data.attachments?.[0]?.proxy_url) {
                  newImage.url = data.attachments[0].proxy_url;
                  toast.success("Using Discord CDN for image storage");
                }
                return saveImageToDb(newImage);
              })
              .then(() => {
                onUpload(newImage);
                toast.success("Image uploaded successfully!");
              })
              .catch((error) => {
                console.error("Error with webhook or saving:", error);
                // If webhook fails, fallback to local storage
                saveImageToDb(newImage)
                  .then(() => {
                    onUpload(newImage);
                    toast.success("Image uploaded successfully (local storage)!");
                  })
                  .catch((err) => {
                    console.error("Error saving image:", err);
                    toast.error("Failed to save image");
                  });
              });
          } else {
            // No webhook configured, save locally
            saveImageToDb(newImage)
              .then(() => {
                onUpload(newImage);
                toast.success("Image uploaded successfully!");
              })
              .catch((error) => {
                console.error("Error saving image:", error);
                toast.error("Failed to save image");
              });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [onUpload, aquariumId]
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