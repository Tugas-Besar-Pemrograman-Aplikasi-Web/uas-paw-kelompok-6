import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";

export default function DestinationCard({
  destination,
  totalPackages,
  popularPackages,
  onView,
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48">
        <img
          src={getImageUrl(destination.photoUrl)}
          alt={destination.name}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute right-4 top-4 bg-white/90 text-gray-900">
          <MapPin className="mr-1 h-3 w-3" />
          {destination.country}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle>{destination.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {destination.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          {totalPackages} packages available
        </div>

        {popularPackages.length > 0 && (
          <ul className="text-sm text-muted-foreground">
            {popularPackages.map((pkg) => (
              <li key={pkg.id} className="line-clamp-1">
                • {pkg.name} – ${pkg.price}
              </li>
            ))}
          </ul>
        )}

        <Button className="w-full" onClick={onView}>
          View All Packages
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
