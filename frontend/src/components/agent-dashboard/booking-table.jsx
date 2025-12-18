import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BookingsTable({
  bookings,
  packages,
  onUpdateStatus,
}) {
  const getColor = (s) =>
    s === "confirmed"
      ? "bg-green-500/10 text-green-700"
      : s === "cancelled"
      ? "bg-red-500/10 text-red-700"
      : "bg-yellow-500/10 text-yellow-700";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Package</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Travelers</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings.map((b) => {
          const pkg = packages.find((p) => p.id === b.packageId);
          if (!pkg) return null;

          return (
            <TableRow key={b.id}>
              <TableCell>{pkg.name}</TableCell>
              <TableCell>{format(new Date(b.travelDate), "PP")}</TableCell>
              <TableCell>{b.travelersCount}</TableCell>
              <TableCell>${b.totalPrice.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getColor(b.status)}>{b.status}</Badge>
              </TableCell>
              <TableCell>
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(b.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onUpdateStatus(b.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
