import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Filters({
  searchQuery,
  selectedCountry,
  countries,
  onSearch,
  onSelectCountry,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search destinations..."
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {countries.map((country) => (
          <Button
            key={country}
            size="sm"
            variant={selectedCountry === country ? "default" : "outline"}
            onClick={() => onSelectCountry(country)}
            className="capitalize"
          >
            {country}
          </Button>
        ))}
      </div>
    </div>
  );
}
