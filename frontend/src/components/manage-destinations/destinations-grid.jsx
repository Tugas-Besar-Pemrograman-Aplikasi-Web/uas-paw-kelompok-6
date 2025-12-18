import DestinationCard from "./destination-card";

export default function DestinationsGrid({ destinations, onEdit, onDelete }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {destinations.map((dest) => (
        <DestinationCard
          key={dest.id}
          dest={dest}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
