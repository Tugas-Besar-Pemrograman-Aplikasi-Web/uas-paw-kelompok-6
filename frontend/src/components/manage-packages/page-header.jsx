import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ onBack }) {
  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-4xl">Manage Packages</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage your travel packages
          </p>
        </div>

        <Button onClick={() => (window.location.href = "/create-package")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Package
        </Button>
      </div>
    </div>
  );
}
