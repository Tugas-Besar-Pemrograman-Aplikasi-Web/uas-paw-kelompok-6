import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export default function StatsSummary({ stats }) {
  const items = [
    { label: "Total", value: stats.total },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2 },
    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
    { label: "Pending", value: stats.pending, icon: AlertCircle },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {items.map((i) => (
        <Card key={i.label}>
          <CardContent className="p-6">
            <div className="text-xs uppercase text-muted-foreground mb-2">
              {i.label}
            </div>
            <div className="text-3xl font-bold">{i.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
