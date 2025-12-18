import DestinationCard from "./destination-card";

export default function DestinationsGrid({
  destinations,
  getPopularPackages,
  getTotalPackages,
  onViewPackages,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((dest) => (
        <DestinationCard
          key={dest.id}
          destination={dest}
          totalPackages={getTotalPackages(dest.id)}
          popularPackages={getPopularPackages(dest.id)}
          onView={() => onViewPackages(dest.id)}
        />
      ))}
    </div>
  );
}
