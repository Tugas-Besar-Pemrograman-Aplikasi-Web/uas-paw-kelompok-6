import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions({ onNavigate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button onClick={() => onNavigate("/create-package")}>
          Create Package
        </Button>
        <Button variant="outline" onClick={() => onNavigate("/manage-packages")}>
          Manage Packages
        </Button>
        <Button onClick={() => onNavigate("/create-destination")}>
          Create Destination
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate("/manage-destinations")}
        >
          Manage Destinations
        </Button>
      </CardContent>
    </Card>
  );
}
