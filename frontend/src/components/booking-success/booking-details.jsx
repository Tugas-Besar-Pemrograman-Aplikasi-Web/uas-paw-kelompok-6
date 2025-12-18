import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

export default function BookingDetails({
  booking,
  pkg,
  destination,
  formatDate,
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {destination.name}, {destination.country}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {formatDate(booking.travelDate)}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {booking.travelersCount} travelers
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {pkg.duration} days
          </div>
          <div className="font-semibold">
            Total: ${booking.totalPrice.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
