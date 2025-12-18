import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "./booking-card";

export default function BookingsTabs({
  bookings,
  packages,
  destinations,
  onCancel,
  onViewPackage,
  onUploadPayment,
}) {
  const statuses = ["all", "confirmed", "pending", "cancelled"];

  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-4">
        {statuses.map((s) => (
          <TabsTrigger key={s} value={s}>
            {s}
          </TabsTrigger>
        ))}
      </TabsList>

      {statuses.map((status) => (
        <TabsContent key={status} value={status} className="space-y-4">
          {bookings
            .filter((b) => status === "all" || b.status === status)
            .map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                pkg={packages.find((p) => p.id === booking.packageId)}
                destination={destinations.find(
                  (d) =>
                    d.id ===
                    packages.find((p) => p.id === booking.packageId)
                      ?.destinationId
                )}
                onCancel={onCancel}
                onViewPackage={onViewPackage}
                onUploadPayment={onUploadPayment}
              />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
