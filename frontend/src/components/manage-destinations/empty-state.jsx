import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ isSearching, onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="mb-2 text-lg font-semibold">
        {isSearching ? "No destinations found" : "No destinations yet"}
      </h3>

      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {isSearching
          ? "Try adjusting your search keywords."
          : "Start by creating your first destination."}
      </p>

      {!isSearching && (
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Destination
        </Button>
      )}
    </div>
  );
}
