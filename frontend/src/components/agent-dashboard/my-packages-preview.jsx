import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyPackagesPreview({
  packages,
  destinations,
  bookings,
  onView,
  onManage,
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>My Packages</CardTitle>
        <Button variant="outline" onClick={onManage}>
          View All
        </Button>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.slice(0, 6).map((pkg) => {
          const destination = destinations.find(
            (d) => d.id === pkg.destinationId
          );
          const count = bookings.filter((b) => b.packageId === pkg.id).length;

          return (
            <Card
              key={pkg.id}
              className="cursor-pointer hover:shadow-lg"
              onClick={() => onView(pkg.id)}
            >
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {destination?.name}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{count} bookings</span>
                  <span className="font-bold">${pkg.price}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
