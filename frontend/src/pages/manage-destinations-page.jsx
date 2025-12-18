import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import MainLayout from "@/layout/main-layout";
import { useSEO } from "@/hooks/use-seo";
import { useAuthStore } from "@/store/auth-store";
import { useManageDestinations } from "@/hooks/use-manage-destinations";

import PageHeader from "@/components/manage-destinations/page-header";
import StatsCards from "@/components/manage-destinations/stats-cards";
import SearchBar from "@/components/manage-destinations/search-bar";
import DestinationsGrid from "@/components/manage-destinations/destinations-grid";
import EmptyState from "@/components/manage-destinations/empty-state";
import DeleteDialog from "@/components/manage-destinations/delete-dialog";

export default function ManageDestinationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const {
    isLoading,
    destinations,
    filteredDestinations,
    searchQuery,
    deleteId,
    isDeleting,
    setSearchQuery,
    setDeleteId,
    deleteDestination,
  } = useManageDestinations(user, isAuthenticated, navigate);

  useSEO({
    title: "Manage Destinations",
    description: "Manage all destinations. Create, edit, or delete destinations.",
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8">
        <PageHeader onBack={() => navigate("/dashboard")} />

        <StatsCards destinations={destinations} />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {filteredDestinations.length === 0 ? (
          <EmptyState
            isSearching={!!searchQuery}
            onCreate={() => navigate("/create-destination")}
          />
        ) : (
          <DestinationsGrid
            destinations={filteredDestinations}
            onEdit={(id) => navigate(`/edit-destination/${id}`)}
            onDelete={setDeleteId}
          />
        )}

        <DeleteDialog
          open={deleteId !== null}
          isDeleting={isDeleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => deleteId && deleteDestination(deleteId)}
        />
      </section>
    </MainLayout>
  );
}
