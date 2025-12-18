import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";
import * as bookingService from "@/services/booking.service";

export function useManagePackages(userId) {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePackageId, setDeletePackageId] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const [agentPackages, allDestinations] = await Promise.all([
        packageService.getPackagesByAgent(userId),
        destinationService.getAllDestinations(),
      ]);

      setPackages(agentPackages);
      setDestinations(allDestinations);

      const bookingRequests = agentPackages.map((pkg) =>
        bookingService
          .getBookingsByPackage(pkg.id)
          .catch(() => []) // ⬅️ NO empty catch
      );

      const results = await Promise.all(bookingRequests);
      setBookings(results.flat());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [packages, searchQuery]);

  const deletePackage = async (id) => {
    try {
      await packageService.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Package deleted");
    } catch {
      toast.error("Failed to delete package");
    } finally {
      setDeletePackageId(null);
    }
  };

  return {
    // state
    isLoading,
    packages,
    destinations,
    bookings,
    searchQuery,
    deletePackageId,
    filteredPackages,

    // actions
    setSearchQuery,
    setDeletePackageId,
    deletePackage,
    refetch: fetchData,
  };
}
