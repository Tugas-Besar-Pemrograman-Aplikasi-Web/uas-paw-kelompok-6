import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import * as destinationService from "@/services/destination.service";

export function useManageDestinations(user, isAuthenticated, navigate) {
  const [isLoading, setIsLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await destinationService.getAllDestinations();
      setDestinations(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load destinations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "agent") {
      navigate("/sign-in");
      return;
    }
    fetchDestinations();
  }, [isAuthenticated, user, navigate, fetchDestinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [destinations, searchQuery]);

  const deleteDestination = async (id) => {
    setIsDeleting(true);
    try {
      await destinationService.deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      toast.success("Destination deleted successfully");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete destination";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return {
    // state
    isLoading,
    destinations,
    filteredDestinations,
    searchQuery,
    deleteId,
    isDeleting,

    // actions
    setSearchQuery,
    setDeleteId,
    deleteDestination,
  };
}
