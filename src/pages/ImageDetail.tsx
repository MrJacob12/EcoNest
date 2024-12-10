import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { marked } from "marked";
import type { AquariumImage } from "@/types";
import { saveImageToDb, getImageFromDb } from "@/utils/indexedDB"; // Importujemy funkcje
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<AquariumImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (id) {
      getImageFromDb(id).then((foundImage) => {
        if (foundImage) {
          setImage(foundImage);
          setDescription(foundImage.description);
          setIsAnalyzed(foundImage.analysis || false);
          setTitle(foundImage.title || "");
          setDate(foundImage.date);
        }
      });
    }
  }, [id]);

  const handleSave = () => {
    if (!image) return;

    saveImageToDb({ ...image, description, analysis: isAnalyzed, title, date })
      .then(() => {
        setImage({ ...image, description, analysis: isAnalyzed, title, date });
        setIsEditing(false);
        toast.success("Changes saved successfully!");
      })
      .catch(() => toast.error("Failed to save changes"));
  };

  if (!image) {
    return (
      <div className="container py-8">
        <div className="text-center text-gray-500">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Image not found</h2>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Return to Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden shadow-lg animate-scale-in">
            <img
              src={image.url}
              alt={`Aquarium on ${image.date}`}
              className="w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <p className="text-lg font-semibold">{image.date}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full animate-fade-in">
                  Analyze with AI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How to Analyze</DialogTitle>
                  <DialogDescription>
                    Use the following instructions to analyze your aquarium
                    image manually:
                    <div className="prose max-w-none space-y-4">
                      <p>
                        Copy and paste the following prompt into ChatGPT
                        <span className="text-yellow-600 font-bold">
                          {" "}
                          (Add image)
                        </span>
                        :
                      </p>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                        Analyze this aquarium image. Focus on plant growth,
                        water clarity, and overall health indicators. Provide a
                        detailed scientific analysis. Response should be in
                        markdown, Show only Scientific Analysis of Aquarium,
                        Language: English
                      </pre>
                      <p>
                        ChatGPT will provide you with a detailed analysis based
                        on the provided image.
                      </p>
                      <p>
                        You can access ChatGPT through the following link:{" "}
                        <a
                          href="https://chat.openai.com"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          ChatGPT
                        </a>
                      </p>
                      <p>
                        Alternatively, you can use Copilot Microsoft for similar
                        analysis:{" "}
                        <a
                          href="https://copilot.microsoft.com/"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          Copilot Microsoft
                        </a>
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Edit2 className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for the image"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the state of your aquarium..."
                  className="min-h-[150px]"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={isAnalyzed}
                    onChange={() => setIsAnalyzed(!isAnalyzed)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Analysis completed</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setDescription(image.description);
                      setIsAnalyzed(image.analysis || false);
                      setTitle(image.title || "");
                      setDate(image.date);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                <div
                  className="text-gray-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: marked(description || "No description provided."),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
