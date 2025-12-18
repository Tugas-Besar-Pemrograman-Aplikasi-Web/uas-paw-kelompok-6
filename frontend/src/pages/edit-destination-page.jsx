import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import MainLayout from "@/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAuthStore } from "@/store/auth-store";
import { useSEO } from "@/hooks/use-seo";
import { useEditDestination } from "@/hooks/use-edit-destination";

export default function EditDestinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const {
    isLoading,
    isSubmitting,
    formData,
    updateField,
    submit,
  } = useEditDestination({
    id,
    user,
    isAuthenticated,
    navigate,
  });

  useSEO({
    title: "Edit Destination",
    description: "Update destination details and information.",
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/manage-destinations")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Button>

        <h1 className="text-3xl font-bold">Edit Destination</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Destination Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Destination Name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />

                  <Input
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />

                  <Textarea
                    placeholder="Description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                  />

                  <Input
                    placeholder="Photo URL"
                    value={formData.photo_url}
                    onChange={(e) =>
                      updateField("photo_url", e.target.value)
                    }
                  />

                  {formData.photo_url && (
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      className="h-48 w-full rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Update</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Destination"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => navigate("/manage-destinations")}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}
