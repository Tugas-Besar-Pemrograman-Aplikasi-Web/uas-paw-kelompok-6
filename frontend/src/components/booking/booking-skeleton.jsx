import { Skeleton } from "@/components/ui/skeleton";

export default function BookingSkeleton() {
  return (
    <section className="space-y-6 py-8">
      <Skeleton className="h-10 w-32" />
      <div className="grid gap-8 lg:grid-cols-3">
        <Skeleton className="h-96 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </section>
  );
}
