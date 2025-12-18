import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import * as analyticsService from "@/services/analytics.service";
import * as packageService from "@/services/package.service";
import * as bookingService from "@/services/booking.service";
import * as destinationService from "@/services/destination.service";

export function useAgentDashboard(userId) {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // 1. Packages
      const agentPackages = await packageService.getPackagesByAgent(userId);
      setPackages(agentPackages);

      // 2. Destinations
      const allDestinations = await destinationService.getAllDestinations();
      setDestinations(allDestinations);

      // 3. Bookings (parallel, aman)
      const bookingRequests = agentPackages.map((pkg) =>
        bookingService
          .getBookingsByPackage(pkg.id)
          .catch(() => [])
      );
      const results = await Promise.all(bookingRequests);
      const allBookings = results.flat();
      setBookings(allBookings);

      // 4. Analytics (fallback kalau endpoint gagal)
      try {
        const analytics = await analyticsService.getAgentStats();
        setStats(analytics);
      } catch {
        setStats({
          totalPackages: agentPackages.length,
          totalBookings: allBookings.length,
          pendingBookings: allBookings.filter(
            (b) => b.status === "pending"
          ).length,
          confirmedBookings: allBookings.filter(
            (b) => b.status === "confirmed"
          ).length,
          totalRevenue: allBookings
            .filter((b) => b.status === "confirmed")
            .reduce((sum, b) => sum + b.totalPrice, 0),
          averageRating: 0,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus({ id: bookingId, status });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status } : b
        )
      );
      toast.success(`Booking ${status} successfully`);
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  return {
    // state
    isLoading,
    packages,
    bookings,
    destinations,
    stats,

    // actions
    updateBookingStatus,
    refetch: fetchDashboardData,
  };
}
