import { useEffect, useState } from "react";
import { useDestinationStore } from "@/store/destination-store";
import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";

export function useLandingPage() {
  const { destinations, packages, setDestinations, setPackages } =
    useDestinationStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packagesData, destinationsData] = await Promise.all([
          packageService.getAllPackages(),
          destinationService.getAllDestinations(),
        ]);

        if (!isMounted) return;

        setPackages(packagesData);
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Failed to fetch landing page data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [setPackages, setDestinations]);

  return {
    isLoading,
    destinations,
    packages,
  };
}
