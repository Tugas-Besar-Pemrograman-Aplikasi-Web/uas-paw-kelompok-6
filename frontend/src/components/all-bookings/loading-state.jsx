import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          Loading booking details...
        </CardContent>
      </Card>
    </div>
  );
}
