import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Upload } from "lucide-react";

export default function PaymentSection({
  booking,
  qrisData,
  qrisError,
  isGeneratingQr,
  onUpload,
  onGenerateQr,
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {booking.paymentStatus === "verified" ? (
          <p className="text-green-600 font-semibold">
            Payment verified. Thank you!
          </p>
        ) : (
          <>
            {qrisData?.url && (
              <div className="text-center space-y-2">
                <img
                  src={qrisData.url}
                  alt="QRIS"
                  className="mx-auto h-56 object-contain"
                />
                <p className="text-sm text-muted-foreground">
                  Scan QRIS to pay <b>${qrisData.amount}</b>
                </p>
              </div>
            )}

            {qrisError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {qrisError}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={onGenerateQr}
                disabled={isGeneratingQr}
              >
                {isGeneratingQr ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating QRIS
                  </>
                ) : (
                  "Regenerate QRIS"
                )}
              </Button>

              <label className="w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                />
                <Button asChild className="w-full sm:w-auto">
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Payment Proof
                  </span>
                </Button>
              </label>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
