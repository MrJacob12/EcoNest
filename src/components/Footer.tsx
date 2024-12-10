import { ExternalLink, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { exportDataToDb, importDataFromDb } from "@/utils/indexedDB";

function Footer() {
  const handleExport = async () => {
    try {
      const data = await exportDataToDb();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();

      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data.");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = e.target?.result as string;
        await importDataFromDb(json);
        toast.success("Data imported successfully!");
      } catch (error) {
        console.error("Error importing data:", error);
        toast.error("Failed to import data.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <footer className="w-full py-6 mt-auto border-t animate-fade-in">
      <div className="container flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Created by</span>
          <a
            href="https://jakub.buciuto.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            jakub.buciuto.com
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Settings className="h-5 w-5" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Global Settings</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              {/* Export */}
              <div className="h-10">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
                >
                  Export Data
                </button>
              </div>

              {/* Import */}
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  id="import-data"
                  className="rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hidden"
                />

                <label htmlFor={"import-data"}>
                  <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent h-10 px-4 py-2">
                    Import Data
                  </span>
                </label>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
}

export default Footer;
