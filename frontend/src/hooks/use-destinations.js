import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import * as destinationService from "@/services/destination.service";
import * as packageService from "@/services/package.service";
import { useDestinationStore } from "@/store/destination-store";

export function useDestinations() {
  const { destinations, packages, setDestinations, setPackages } =
    useDestinationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [destinationsData, packagesData] = await Promise.all([
        destinationService.getAllDestinations(),
        packageService.getAllPackages(),
      ]);
      setDestinations(destinationsData);
      setPackages(packagesData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load destinations");
    } finally {
      setIsLoading(false);
    }
  }, [setDestinations, setPackages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const countries = useMemo(() => {
    const unique = Array.from(new Set(destinations.map((d) => d.country)));
    return ["all", ...unique.sort()];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        dest.name.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q);

      const matchesCountry =
        selectedCountry === "all" || dest.country === selectedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [destinations, searchQuery, selectedCountry]);

  const getPopularPackages = useCallback(
    (destinationId) => {
      return packages
        .filter((p) => p.destinationId === destinationId)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
    },
    [packages]
  );

  const getTotalPackages = useCallback(
    (destinationId) =>
      packages.filter((p) => p.destinationId === destinationId).length,
    [packages]
  );

  return {
    isLoading,
    destinations: filteredDestinations,
    countries,
    searchQuery,
    selectedCountry,
    setSearchQuery,
    setSelectedCountry,
    getPopularPackages,
    getTotalPackages,
  };
}
