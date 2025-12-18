import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SearchBar({ value, onChange }) {
  return (
    <Card>
      <CardContent className="p-6">
        <Input
          placeholder="Search packages by name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-md"
        />
      </CardContent>
    </Card>
  );
}
