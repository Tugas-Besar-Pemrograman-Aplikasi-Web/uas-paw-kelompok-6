import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ onClear }) {
  return (
    <div className="py-16 text-center">
      <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">No destinations found</h3>
      <p className="mb-4 text-muted-foreground">
        Try adjusting your search or filters
      </p>
      <Button variant="outline" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
