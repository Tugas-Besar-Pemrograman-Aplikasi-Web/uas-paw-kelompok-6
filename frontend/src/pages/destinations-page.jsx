import { useNavigate } from "react-router-dom";
import MainLayout from "@/layout/main-layout";
import { useSEO } from "@/hooks/use-seo";
import { useDestinations } from "@/hooks/use-destinations";

import PageHeader from "@/components/destinations/page-header";
import Filters from "@/components/destinations/filters";
import ResultsCount from "@/components/destinations/result-count";
import DestinationsGrid from "@/components/destinations/destinations-grid";
import EmptyState from "@/components/destinations/empy-state";

export default function DestinationsPage() {
  const navigate = useNavigate();

  const {
    isLoading,
    destinations,
    countries,
    searchQuery,
    selectedCountry,
    setSearchQuery,
    setSelectedCountry,
    getPopularPackages,
    getTotalPackages,
  } = useDestinations();

  useSEO({
    title: "Destinations",
    description: "Explore amazing travel destinations around the world",
  });

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <PageHeader />

        <Filters
          searchQuery={searchQuery}
          selectedCountry={selectedCountry}
          countries={countries}
          onSearch={setSearchQuery}
          onSelectCountry={setSelectedCountry}
        />

        <ResultsCount count={destinations.length} />

        {isLoading ? null : destinations.length === 0 ? (
          <EmptyState
            onClear={() => {
              setSearchQuery("");
              setSelectedCountry("all");
            }}
          />
        ) : (
          <DestinationsGrid
            destinations={destinations}
            getPopularPackages={getPopularPackages}
            getTotalPackages={getTotalPackages}
            onViewPackages={(id) =>
              navigate(`/packages?destination=${id}`)
            }
          />
        )}
      </section>
    </MainLayout>
  );
}
