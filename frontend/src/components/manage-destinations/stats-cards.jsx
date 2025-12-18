import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ destinations }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card><CardContent className="p-6">
        <div className="text-xs uppercase text-muted-foreground">Total</div>
        <div className="text-3xl font-bold">{destinations.length}</div>
      </CardContent></Card>

      <Card><CardContent className="p-6">
        <div className="text-xs uppercase text-muted-foreground">Countries</div>
        <div className="text-3xl font-bold">
          {new Set(destinations.map((d) => d.country)).size}
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-6">
        <div className="text-xs uppercase text-muted-foreground">
          With Packages
        </div>
        <div className="text-3xl font-bold">
          {destinations.filter((d) => d.packageCount > 0).length || 0}
        </div>
      </CardContent></Card>
    </div>
  );
}
