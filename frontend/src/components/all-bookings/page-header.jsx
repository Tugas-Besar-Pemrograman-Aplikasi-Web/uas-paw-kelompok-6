import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ onBack }) {
  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold md:text-4xl">All My Bookings</h1>
      <p className="text-muted-foreground mt-2">
        View and manage all your travel bookings
      </p>
    </div>
  );
}
