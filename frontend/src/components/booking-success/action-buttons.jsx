import { Button } from "@/components/ui/button";

export default function ActionButtons({
  countdown,
  onDashboard,
  onBrowse,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <Button onClick={onDashboard}>
        Go to Dashboard ({countdown})
      </Button>
      <Button variant="outline" onClick={onBrowse}>
        Browse More Packages
      </Button>
    </div>
  );
}
