import { CheckCircle } from "lucide-react";

export default function SuccessHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold">Booking Confirmed</h1>
      <p className="text-muted-foreground">
        Your travel package has been successfully booked
      </p>
    </div>
  );
}
