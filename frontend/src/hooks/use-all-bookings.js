import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

import * as bookingService from "@/services/booking.service";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";
import * as paymentService from "@/services/payment.service";

export function useAllBookings(userId) {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [uploadingPaymentProof, setUploadingPaymentProof] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [b, p, d] = await Promise.all([
          bookingService.getBookingsByTourist(userId),
          packageService.getAllPackages(),
          destinationService.getAllDestinations(),
        ]);

        setBookings(b);
        setPackages(p);
        setDestinations(d);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const uploadPaymentProof = async (bookingId, file) => {
    setUploadingPaymentProof(bookingId);
    try {
      await paymentService.uploadPaymentProof(bookingId, file);
      toast.success("Payment proof uploaded. Waiting for verification.");

      const updated = await bookingService.getBookingsByTourist(userId);
      setBookings(updated);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to upload payment proof");
    } finally {
      setUploadingPaymentProof(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  return {
    isLoading,
    bookings,
    packages,
    destinations,
    stats,
    uploadingPaymentProof,
    uploadPaymentProof,
  };
}
