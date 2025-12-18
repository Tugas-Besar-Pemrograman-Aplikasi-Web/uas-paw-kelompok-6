import { Button } from "@/components/ui/button";

export default function EmptyState({ status }) {
  return (
    <div className="p-12 text-center text-muted-foreground">
      <p className="mb-4">
        No {status !== "all" && status} bookings found
      </p>
      <Button>Browse Packages</Button>
    </div>
  );
}
