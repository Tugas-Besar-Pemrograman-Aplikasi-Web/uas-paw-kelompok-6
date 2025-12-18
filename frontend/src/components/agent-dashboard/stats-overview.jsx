import {
  PackageIcon,
  Users,
  AlertCircle,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsOverview({ stats }) {
  const averageRating = stats.averageRating?.toFixed(1) ?? "0.0";
  const avgBookingValue =
    stats.confirmedBookings > 0
      ? (stats.totalRevenue / stats.confirmedBookings).toFixed(0)
      : 0;

  const items = [
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: PackageIcon,
      desc: `Avg rating ${averageRating} ⭐`,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Users,
      desc: "All time bookings",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: AlertCircle,
      desc: "Needs attention",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      desc: `$${avgBookingValue} avg value`,
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      desc: "Confirmed bookings",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
