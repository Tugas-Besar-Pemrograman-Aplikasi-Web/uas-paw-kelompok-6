import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainLayout from "@/layout/main-layout";
import { useSEO } from "@/hooks/use-seo";
import { useAuthStore } from "@/store/auth-store";
import { useManagePackages } from "@/hooks/use-packages";

import PageHeader from "@/components/manage-packages/page-header";
import StatsCards from "@/components/manage-packages/stats-cards";
import SearchBar from "@/components/manage-packages/search-bar";
import PackageCard from "@/components/manage-packages/package-card";
import EmptyState from "@/components/manage-packages/empty-state";
import DeletePackageDialog from "@/components/manage-packages/delete-package-dialog";

export default function ManagePackagesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const {
    isLoading,
    destinations,
    bookings,
    searchQuery,
    filteredPackages,
    deletePackageId,
    setSearchQuery,
    setDeletePackageId,
    deletePackage,
  } = useManagePackages(user?.id);

  useSEO({
    title: "Manage Packages",
    description: "Manage all your travel packages",
  });

  if (!isAuthenticated || user?.role !== "agent") {
    navigate("/sign-in");
    return null;
  }

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

        <StatsCards
          packages={filteredPackages}
          bookings={bookings}
        />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              destination={destinations.find(
                (d) => d.id === pkg.destinationId
              )}
              bookings={bookings.filter((b) => b.packageId === pkg.id)}
              onView={() => navigate(`/packages/${pkg.id}`)}
              onEdit={() => navigate(`/edit-package/${pkg.id}`)}
              onDelete={() => setDeletePackageId(pkg.id)}
            />
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <EmptyState
            isSearching={!!searchQuery}
            onCreate={() => navigate("/create-package")}
          />
        )}

        <DeletePackageDialog
          open={deletePackageId !== null}
          onCancel={() => setDeletePackageId(null)}
          onConfirm={() => deletePackage(deletePackageId)}
        />
      </section>
    </MainLayout>
  );
}
