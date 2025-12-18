import { format, addDays, isAfter, isBefore } from "date-fns";
import { Calendar as CalendarIcon, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const minDate = addDays(new Date(), 3);
const maxDate = addDays(new Date(), 365);
const isDateValid = (date) => isAfter(date, minDate) && isBefore(date, maxDate);

export default function BookingForm({
  pkg,
  destination,
  user,
  travelDate,
  setTravelDate,
  travelersCount,
  setTravelersCount,
}) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/30 p-4">
            <h3 className="font-semibold">{pkg.name}</h3>
            <p className="text-muted-foreground text-sm">
              {destination.name}, {destination.country}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="text-sm font-medium">Select Travel Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {travelDate ? format(travelDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={travelDate}
                  onSelect={setTravelDate}
                  disabled={(date) => !isDateValid(date)}
                />
              </PopoverContent>
            </Popover>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Book at least 3 days in advance
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Number of Travelers</label>
            <Select
              value={travelersCount.toString()}
              onValueChange={(v) => setTravelersCount(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: pkg.maxTravelers }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    <Users className="mr-2 inline h-4 w-4" />
                    {n} Travelers
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Booked by</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
