import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import * as bookingService from "@/services/booking.service";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";
import * as paymentService from "@/services/payment.service";
import * as qrisService from "@/services/qris.service";

import { useDestinationStore } from "@/store/destination-store";
import { useBookingStore } from "@/store/booking-store";

export function useBookingSuccess(bookingId) {
  const { setDestinations, setPackages } = useDestinationStore();
  const { uploadPaymentProof } = useBookingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [destination, setDestination] = useState(null);

  const [countdown, setCountdown] = useState(10);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrisData, setQrisData] = useState({ url: null, amount: null });
  const [qrisError, setQrisError] = useState(null);

  // ================= FETCH DATA =================
  const fetchBookingData = useCallback(async () => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = await bookingService.getBookingById(bookingId);
      setBooking(bookingData);

      const packageData = await packageService.getPackageById(
        bookingData.packageId
      );
      setPkg(packageData);
      setPackages([packageData]);

      const destinationsData =
        await destinationService.getAllDestinations();
      setDestinations(destinationsData);

      const dest = destinationsData.find(
        (d) => d.id === packageData.destinationId
      );
      setDestination(dest || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, setDestinations, setPackages]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  // ================= PAYMENT =================
  const uploadPayment = async (file) => {
    if (!bookingId || !booking) return;

    try {
      const result = await paymentService.uploadPaymentProof(
        bookingId,
        file
      );

      setBooking((prev) => ({
        ...prev,
        paymentProofUrl: result.paymentProofUrl,
        paymentStatus: result.paymentStatus,
      }));

      uploadPaymentProof(bookingId, file);
      toast.success("Payment proof uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload payment proof");
      throw err;
    }
  };

  // ================= QRIS =================
  const generateQr = useCallback(async () => {
    if (!booking?.totalPrice) return;

    setIsGeneratingQr(true);
    setQrisError(null);

    try {
      const result = await qrisService.generatePaymentQRIS(
        booking.totalPrice
      );

      const qrUrl =
        result?.fotoQrUrl ||
        result?.qrCodeImage ||
        result?.qr_string ||
        null;

      setQrisData({
        url: qrUrl,
        amount:
          result?.totalAmount ??
          result?.amount ??
          booking.totalPrice,
      });

      if (!qrUrl) {
        setQrisError(
          "QRIS belum tersedia. Pastikan admin sudah mengunggah QRIS statis."
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Gagal membuat QRIS. Coba lagi nanti.";
      setQrisError(msg);
      toast.error(msg);
    } finally {
      setIsGeneratingQr(false);
    }
  }, [booking]);

  useEffect(() => {
    if (
      booking &&
      booking.paymentStatus !== "verified" &&
      !qrisData.url &&
      !isGeneratingQr
    ) {
      generateQr();
    }
  }, [booking, qrisData.url, isGeneratingQr, generateQr]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    isLoading,
    booking,
    pkg,
    destination,
    countdown,
    isGeneratingQr,
    qrisData,
    qrisError,

    uploadPayment,
    generateQr,

    formatDate: (date) => format(new Date(date), "MMM dd, yyyy"),
  };
}
