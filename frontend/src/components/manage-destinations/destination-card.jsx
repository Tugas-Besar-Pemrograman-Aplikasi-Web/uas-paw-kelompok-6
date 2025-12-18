import { Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/services/api";

export default function DestinationCard({ dest, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-4 space-y-4">
        <div className="h-48 overflow-hidden rounded-lg border">
          <img
            src={
              dest.photo_url ||
              dest.photoUrl ||
              `${API_BASE_URL}/destinations/placeholder.jpg`
            }
            alt={dest.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="font-bold">{dest.name}</h3>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {dest.country}
          </p>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {dest.description || "No description"}
        </p>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(dest.id)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive text-destructive"
            onClick={() => onDelete(dest.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
