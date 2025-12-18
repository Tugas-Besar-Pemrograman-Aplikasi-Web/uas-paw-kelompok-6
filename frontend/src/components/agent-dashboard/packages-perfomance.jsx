import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PackagePerformance({ packages, bookings }) {
  const stats = packages
    .map((pkg) => {
      const pkgBookings = bookings.filter((b) => b.packageId === pkg.id);
      const revenue = pkgBookings
        .filter((b) => b.status === "confirmed")
        .reduce((s, b) => s + b.totalPrice, 0);
      return { ...pkg, revenue, bookingsCount: pkgBookings.length };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = stats[0]?.revenue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.slice(0, 5).map((pkg, i) => (
          <div key={pkg.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                #{i + 1} {pkg.name}
              </span>
              <span className="font-semibold">
                ${pkg.revenue.toLocaleString()}
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${(pkg.revenue / maxRevenue) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-muted-foreground text-sm text-center">
            No packages yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
