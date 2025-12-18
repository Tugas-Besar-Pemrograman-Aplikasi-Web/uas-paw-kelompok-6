/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layout/main-layout";
import { useAuthStore } from "@/store/auth-store";
import { useSEO } from "@/hooks/use-seo";
import { useAllBookings } from "@/hooks/use-all-bookings";

import LoadingState from "@/components/all-bookings/loading-state";
import PageHeader from "@/components/all-bookings/page-header";
import StatsSummary from "@/components/all-bookings/stats-summary";
import BookingsTabs from "@/components/all-bookings/bookings-tabs";

export default function AllBookingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useSEO({
    title: "All Bookings",
    description: "View and manage all your travel bookings",
  });

  if (!isAuthenticated || user?.role !== "tourist") {
    navigate("/sign-in");
    return null;
  }

  const data = useAllBookings(user.id);

  if (data.isLoading) return <LoadingState />;

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8">
        <PageHeader onBack={() => navigate("/dashboard")} />

        <StatsSummary stats={data.stats} />

        <BookingsTabs
          bookings={data.bookings}
          packages={data.packages}
          destinations={data.destinations}
          uploadingPaymentProof={data.uploadingPaymentProof}
          onUploadPayment={data.uploadPaymentProof}
        />
      </section>
    </MainLayout>
  );
}
