import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({
  userName,
  onCreatePackage,
  onCreateDestination,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Agent Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {userName}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onCreatePackage}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
        <Button onClick={onCreateDestination}>
          <Plus className="mr-2 h-4 w-4" />
          Create Destination
        </Button>
      </div>
    </div>
  );
}
