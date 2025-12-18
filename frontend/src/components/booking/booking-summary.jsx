import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BookingSummary({
  pkg,
  travelDate,
  travelersCount,
  isSubmitting,
  onConfirm,
}) {
  const basePrice = pkg.price * travelersCount;
  const serviceFee = basePrice * 0.05;
  const tax = basePrice * 0.1;
  const total = basePrice + serviceFee + tax;

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package</span>
              <span>{pkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Travelers</span>
              <span>{travelersCount}</span>
            </div>
            {travelDate && (
              <div className="flex justify-between">
                <span>Date</span>
                <span>{format(travelDate, "PP")}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button
            disabled={!travelDate || isSubmitting}
            className="w-full"
            onClick={() => onConfirm(total)}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
