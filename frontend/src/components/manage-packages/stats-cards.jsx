import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ packages, bookings }) {
  const revenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const avgRating =
    packages.length > 0
      ? (
          packages.reduce((sum, p) => sum + (p.rating || 0), 0) /
          packages.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[
        ["Total Packages", packages.length],
        ["Total Bookings", bookings.length],
        ["Avg Rating", avgRating],
        ["Total Revenue", `$${revenue.toLocaleString()}`],
      ].map(([label, value]) => (
        <Card key={label}>
          <CardContent className="p-6">
            <div className="text-muted-foreground text-xs uppercase">{label}</div>
            <div className="text-3xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
