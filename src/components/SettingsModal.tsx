import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { exportDataToDb, importDataFromDb } from "@/utils/indexedDB";
const SettingsModal = () => {
  const handleExportData = () => {
    exportDataToDb()
      .then((data) => {
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "aquarium-data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully!");
      })
      .catch(() => {
        toast.error("Error exporting data!");
      });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          importDataFromDb(content)
            .then(() => {
              toast.success("Data imported successfully!");
              window.location.reload();
            })
            .catch(() => {
              toast.error("Error importing data!");
            });
        } catch (error) {
          toast.error("Error importing data!");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 animate-fade-in"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Management</label>
            <div className="flex gap-2">
              <Button onClick={handleExportData} className="flex-1">
                Export Data
              </Button>
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-data"
                />
                <label htmlFor="import-data">
                  <Button className="w-full" variant="outline" asChild>
                    <span>Import Data</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
