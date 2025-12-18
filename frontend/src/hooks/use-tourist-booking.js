import { useState, useCallback } from "react";
import { toast } from "sonner";
import * as bookingService from "@/services/booking.service";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";

export function useTouristBookings(userId) {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const myBookings = await bookingService.getBookingsByTourist(userId);
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
  }, [userId]);

  const cancelBooking = async (bookingId) => {
    await bookingService.cancelBooking(bookingId);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return {
    isLoading,
    bookings,
    packages,
    destinations,
    fetchDashboardData,
    handleCancelBooking,
  };
}
