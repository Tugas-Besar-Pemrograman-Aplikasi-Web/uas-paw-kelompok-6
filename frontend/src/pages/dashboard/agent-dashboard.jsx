import { useNavigate } from "react-router-dom";

import MainLayout from "@/layout/main-layout";
import { useAuthStore } from "@/store/auth-store";
import { useSEO } from "@/hooks/use-seo";
import { useAgentDashboard } from "@/hooks/use-agent-dashboard";

import DashboardHeader from "@/components/agent-dashboard/dashboard-header";
import StatsOverview from "@/components/agent-dashboard/stats-overview";
import QuickActions from "@/components/agent-dashboard/quick-actions";
import RevenueOverview from "@/components/agent-dashboard/revenue-overview";
import BookingStatusChart from "@/components/agent-dashboard/booking-status-chart";
import BookingsTable from "@/components/agent-dashboard/booking-table";
import MyPackagesPreview from "@/components/agent-dashboard/my-packages-preview";
import LoadingState from "@/components/agent-dashboard/loading-state";
import { PaymentVerification } from "@/components/payment-verification";
import { QRISManagement } from "@/components/qris-management";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const {
    isLoading,
    packages,
    bookings,
    destinations,
    stats,
    updateBookingStatus,
  } = useAgentDashboard(user?.id);

  useSEO({
    title: "Agent Dashboard",
    description: "Manage your travel packages and bookings",
  });

  if (!isAuthenticated || user?.role !== "agent") {
    navigate("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <DashboardHeader
          userName={user?.name}
          onCreatePackage={() => navigate("/create-package")}
          onCreateDestination={() => navigate("/create-destination")}
        />

        <StatsOverview stats={stats} packages={packages} />

        <QuickActions onNavigate={navigate} />

        <div className="grid gap-6 md:grid-cols-2">
          <RevenueOverview stats={stats} />
        </div>

        <BookingStatusChart bookings={bookings} stats={stats} />

        <BookingsTable
          bookings={bookings}
          packages={packages}
          onUpdateStatus={updateBookingStatus}
        />

        <MyPackagesPreview
          packages={packages}
          destinations={destinations}
          bookings={bookings}
          onView={(id) => navigate(`/packages/${id}`)}
          onManage={() => navigate("/manage-packages")}
        />

        <PaymentVerification />
        <QRISManagement />
      </section>
    </MainLayout>
  );
}
