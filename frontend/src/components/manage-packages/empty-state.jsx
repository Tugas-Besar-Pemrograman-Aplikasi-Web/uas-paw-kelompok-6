import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyState({ isSearching, onCreate }) {
  return (
    <Card className="p-12 text-center">
      <p className="text-muted-foreground mb-4">
        {isSearching
          ? "No packages found matching your search"
          : "You haven't created any packages yet"}
      </p>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Package
      </Button>
    </Card>
  );
}
