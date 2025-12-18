import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions({ onNavigate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button onClick={() => onNavigate("/packages")}>
          Browse Packages
        </Button>
        <Button variant="outline" onClick={() => onNavigate("/all-bookings")}>
          View All Bookings
        </Button>
      </CardContent>
    </Card>
  );
}
