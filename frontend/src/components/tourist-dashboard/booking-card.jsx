import { format } from "date-fns";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BookingCard({
  booking,
  pkg,
  destination,
  onCancel,
  onViewPackage,
  onUploadPayment,
}) {
  if (!pkg || !destination) return null;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{pkg.name}</h3>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {destination.name}, {destination.country}
            </p>
            {pkg.contactPhone && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {pkg.contactPhone}
              </p>
            )}
          </div>

          <Badge>{booking.status}</Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(booking.travelDate), "PP")}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {booking.travelersCount}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {pkg.duration} days
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-muted-foreground">Total Price</p>
            <p className="text-xl font-bold">
              ${booking.totalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewPackage(pkg.id)}>
              View Package
            </Button>

            {(booking.paymentStatus === "unpaid" ||
              booking.paymentStatus === "rejected") && (
              <Button
                size="sm"
                onClick={() => onUploadPayment(booking.id)}
              >
                Upload Payment
              </Button>
            )}

            {booking.status === "pending" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(booking.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
