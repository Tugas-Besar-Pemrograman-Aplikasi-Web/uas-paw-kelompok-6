
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image-utils";

export default function PackageCard({
  pkg,
  destination,
  bookings,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="p-2 hover:shadow-lg transition">
      <img
        src={getImageUrl(pkg.images[0])}
        alt={pkg.name}
        className="aspect-video rounded-lg object-cover"
      />

      <CardContent className="space-y-4 p-1">
        <div>
          <h3 className="text-lg font-bold">{pkg.name}</h3>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            {destination?.name}, {destination?.country}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {pkg.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {pkg.maxTravelers}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> ${pkg.price}
          </span>
          <span>{bookings.length} bookings</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onView}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
