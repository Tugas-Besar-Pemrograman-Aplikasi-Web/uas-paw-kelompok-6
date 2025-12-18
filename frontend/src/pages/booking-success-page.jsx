import { useNavigate, useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import { useBookingSuccess } from "@/hooks/use-booking-success";

import LoadingState from "@/components/booking-success/loading-state";
import NotFound from "@/components/booking-success/not-found";
import SuccessHeader from "@/components/booking-success/success-header";
import BookingDetails from "@/components/booking-success/booking-details";
import PaymentSection from "@/components/booking-success/payment-section";
import WhatsNext from "@/components/booking-success/whats-next";
import ActionButtons from "@/components/booking-success/action-buttons";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  const data = useBookingSuccess(bookingId);

  useSEO({
    title: "Booking Successful",
    description: "Your travel booking has been confirmed successfully",
  });

  if (data.isLoading) return <LoadingState />;
  if (!data.booking || !data.pkg || !data.destination)
    return <NotFound onHome={() => navigate("/")} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-3xl">
        <SuccessHeader />

        <BookingDetails
          booking={data.booking}
          pkg={data.pkg}
          destination={data.destination}
          formatDate={data.formatDate}
        />

        <PaymentSection
          booking={data.booking}
          qrisData={data.qrisData}
          qrisError={data.qrisError}
          isGeneratingQr={data.isGeneratingQr}
          onUpload={data.uploadPayment}
          onGenerateQr={data.generateQr}
        />

        <WhatsNext />

        <ActionButtons
          countdown={data.countdown}
          onDashboard={() => navigate("/dashboard")}
          onBrowse={() => navigate("/packages")}
        />
      </div>
    </div>
  );
}
