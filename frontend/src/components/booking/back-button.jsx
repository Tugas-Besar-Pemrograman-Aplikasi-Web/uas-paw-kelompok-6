import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton({ onClick }) {
  return (
    <Button variant="outline" onClick={onClick}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Package Details
    </Button>
  );
}
