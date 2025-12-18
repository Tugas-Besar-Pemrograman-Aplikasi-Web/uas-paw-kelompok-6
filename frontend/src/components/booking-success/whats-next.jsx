import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatsNext() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>What's Next?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>• Complete your payment using QRIS.</p>
        <p>• Upload payment proof for verification.</p>
        <p>• Our agent will confirm your booking shortly.</p>
        <p>• You can track your booking in your dashboard.</p>
      </CardContent>
    </Card>
  );
}
