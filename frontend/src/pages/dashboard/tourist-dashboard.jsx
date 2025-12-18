import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import MainLayout from "@/layout/main-layout";
import { useAuthStore } from "@/store/auth-store";
import { useSEO } from "@/hooks/use-seo";

import * as bookingService from "@/services/booking.service";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";

import DashboardHeader from "@/components/tourist-dashboard/dashboard-header";
import StatsOverview from "@/components/tourist-dashboard/stats-overview";
import QuickActions from "@/components/tourist-dashboard/quick-actions";
import BookingsTabs from "@/components/tourist-dashboard/bookings-tabs";
import LoadingState from "@/components/tourist-dashboard/loading-state";

export default function TouristDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useSEO({
    title: "My Dashboard",
    description: "Manage your travel bookings and trips",
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const myBookings = await bookingService.getBookingsByTourist(user.id);
      setBookings(myBookings);

      const [allPackages, allDestinations] = await Promise.all([
        packageService.getAllPackages(),
        destinationService.getAllDestinations(),
      ]);

      setPackages(allPackages);
      setDestinations(allDestinations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "tourist") return;
    fetchDashboardData();
  }, [fetchDashboardData, isAuthenticated, user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <DashboardHeader userName={user?.name} />

        <StatsOverview bookings={bookings} />

        <QuickActions onNavigate={navigate} />

        <BookingsTabs
          bookings={bookings}
          packages={packages}
          destinations={destinations}
          onCancel={handleCancelBooking}
          onViewPackage={(id) => navigate(`/packages/${id}`)}
          onUploadPayment={(id) =>
            navigate(`/booking-success?bookingId=${id}`)
          }
        />
      </section>
    </MainLayout>
  );
}
