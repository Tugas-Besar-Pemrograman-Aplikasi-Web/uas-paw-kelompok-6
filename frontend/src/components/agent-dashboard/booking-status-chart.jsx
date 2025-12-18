import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingStatusChart({ bookings }) {
  const statuses = ["pending", "confirmed", "cancelled"];

  const counts = statuses.map(
    (s) => bookings.filter((b) => b.status === s).length
  );

  const max = Math.max(...counts, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex h-40 items-end gap-3">
        {statuses.map((status, i) => (
          <div key={status} className="flex flex-1 flex-col items-center">
            <div
              className={`w-full rounded-t ${
                status === "pending"
                  ? "bg-yellow-500"
                  : status === "confirmed"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
              style={{ height: `${(counts[i] / max) * 100}%` }}
            />
            <p className="text-sm font-bold">{counts[i]}</p>
            <p className="text-xs text-muted-foreground">{status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
