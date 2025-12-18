import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/layout/main-layout";
import { useDestinationStore } from "@/store/destination-store";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";
import * as bookingService from "@/services/booking.service";
import { useSEO } from "@/hooks/use-seo";

import BackButton from "@/components/booking/back-button";
import BookingForm from "@/components/booking/booking-form";
import BookingSummary from "@/components/booking/booking-summary";
import BookingSkeleton from "@/components/booking/booking-skeleton";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { destinations, setDestinations } = useDestinationStore();
  const { addBooking } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();

  const [pkg, setPkg] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelDate, setTravelDate] = useState();
  const [travelersCount, setTravelersCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useSEO({
    title: pkg ? `Book ${pkg.name}` : "Book Package",
    description: pkg
      ? `Book your ${pkg.name} package to ${destination?.name}`
      : "Book your travel package",
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const packageData = await packageService.getPackageById(id);
      setPkg(packageData);

      let destList = destinations;
      if (destinations.length === 0) {
        destList = await destinationService.getAllDestinations();
        setDestinations(destList);
      }

      setDestination(
        destList.find((d) => d.id === packageData.destinationId) || null
      );
    } catch (err) {
      toast.error("Failed to load package details");
    } finally {
      setIsLoading(false);
    }
  }, [id, destinations, setDestinations]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", { state: { from: `/book/${id}` } });
      return;
    }
    fetchData();
  }, [fetchData, isAuthenticated, navigate, id]);

  const handleConfirmBooking = async (totalPrice) => {
    if (!travelDate) {
      toast.error("Please select a travel date");
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await bookingService.createBooking({
        packageId: pkg.id,
        travelDate: travelDate.toISOString().split("T")[0],
        travelersCount,
        totalPrice,
      });

      addBooking(booking);
      toast.success("Booking created successfully!");
      navigate(`/booking-success?bookingId=${booking.id}`);
    } catch {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <BookingSkeleton />
      </MainLayout>
    );
  }

  if (!pkg || !destination) {
    return null;
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <BackButton onClick={() => navigate(`/packages/${id}`)} />

        <div className="grid gap-8 lg:grid-cols-3">
          <BookingForm
            pkg={pkg}
            destination={destination}
            user={user}
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            travelersCount={travelersCount}
            setTravelersCount={setTravelersCount}
          />

          <BookingSummary
            pkg={pkg}
            travelDate={travelDate}
            travelersCount={travelersCount}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmBooking}
          />
        </div>
      </section>
    </MainLayout>
  );
}
