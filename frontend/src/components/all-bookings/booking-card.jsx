import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingCard({
  booking,
  packages,
  destinations,
  onUploadPayment,
  uploadingPaymentProof,
}) {
  const pkg = packages.find((p) => p.id === booking.packageId);
  const destination = pkg
    ? destinations.find((d) => d.id === pkg.destinationId)
    : null;

  if (!pkg || !destination) return null;

  return (
    <Card>
      <CardContent className="p-6">
        {/* pindahkan JSX detail booking ke sini */}
        <h3 className="text-xl font-bold">{pkg.name}</h3>

        {/* tombol upload payment, review, dll */}
        {booking.status === "pending" && (
          <Button
            onClick={() => onUploadPayment(booking.id)}
            disabled={uploadingPaymentProof === booking.id}
          >
            Upload Payment Proof
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
