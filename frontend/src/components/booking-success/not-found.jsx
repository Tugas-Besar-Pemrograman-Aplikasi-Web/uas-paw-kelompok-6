import { Button } from "@/components/ui/button";

export default function NotFound({ onHome }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find your booking details.
        </p>
        <Button onClick={onHome}>Back to Home</Button>
      </div>
    </div>
  );
}
