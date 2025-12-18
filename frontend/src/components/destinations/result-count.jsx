export default function ResultsCount({ count }) {
  return (
    <p className="text-sm text-muted-foreground">
      Showing {count} destination{count !== 1 ? "s" : ""}
    </p>
  );
}
