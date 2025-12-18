import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevenueOverview({ stats }) {
  const percentage =
    stats.totalBookings > 0
      ? (stats.confirmedBookings / stats.totalBookings) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </div>

        <div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{stats.confirmedBookings} confirmed</span>
            <span>{stats.pendingBookings} pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
