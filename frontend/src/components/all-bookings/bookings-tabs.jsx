import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "./booking-card";
import EmptyState from "./empty-state";

const STATUSES = ["all", "confirmed", "completed", "pending", "cancelled"];

export default function BookingsTabs(props) {
  const { bookings } = props;

  return (
    <Tabs defaultValue="all">
      <TabsList className="grid grid-cols-5">
        {STATUSES.map((s) => (
          <TabsTrigger key={s} value={s}>
            {s}
          </TabsTrigger>
        ))}
      </TabsList>

      {STATUSES.map((status) => {
        const filtered =
          status === "all"
            ? bookings
            : bookings.filter((b) => b.status === status);

        return (
          <TabsContent key={status} value={status} className="space-y-4">
            {filtered.length === 0 ? (
              <EmptyState status={status} />
            ) : (
              filtered.map((b) => (
                <BookingCard key={b.id} booking={b} {...props} />
              ))
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
