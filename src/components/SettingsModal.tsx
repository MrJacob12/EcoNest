import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { exportDataToDb, importDataFromDb } from "@/utils/indexedDB";
import { useState, useEffect } from "react";
import { GlobalSettings } from "@/types";

const SETTINGS_KEY = "global_settings";

const SettingsModal = () => {
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      const parsed: GlobalSettings = JSON.parse(settings);
      setWebhookUrl(parsed.webhookUrl || "");
    }
  }, []);

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

  const handleSaveWebhook = () => {
    const settings: GlobalSettings = { webhookUrl };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    toast.success("Webhook URL saved successfully!");
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
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button onClick={handleSaveWebhook}>Save</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data Management</Label>
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