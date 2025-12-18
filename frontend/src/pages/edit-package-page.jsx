import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import MainLayout from "@/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuthStore } from "@/store/auth-store";
import { useSEO } from "@/hooks/use-seo";
import { packageSchema } from "@/lib/validations";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useImageArray } from "@/hooks/use-image-array";
import { EditPackageForm } from "@/components/edit-package-form";
import { useEditPackage } from "@/hooks/use-edit-package";

export default function EditPackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const { errors, validate } = useFormValidation(packageSchema);
  const {
    images,
    resetImages,
    addImage,
    removeImage,
    updateImage,
  } = useImageArray();

  const {
    isLoading,
    isSubmitting,
    pkg,
    destinations,
    formData,
    updateField,
    submit,
  } = useEditPackage({
    id,
    user,
    isAuthenticated,
    navigate,
    validate,
    resetImages,
    images,
  });

  useSEO({
    title: "Edit Package",
    description: "Update your travel package details",
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

  if (!pkg) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Package not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/manage-packages")}
            >
              Back to Packages
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-6 py-2 md:space-y-8 md:py-8 lg:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/manage-packages")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Packages
        </Button>

        <h1 className="text-3xl font-bold md:text-4xl">Edit Package</h1>
        <p className="text-muted-foreground">
          Update your travel package information
        </p>

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
                  <CardTitle>Package Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditPackageForm
                    formData={formData}
                    images={images}
                    errors={errors}
                    destinations={destinations}
                    onFieldChange={updateField}
                    onImageAdd={addImage}
                    onImageRemove={removeImage}
                    onImageChange={updateImage}
                  />
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
                    {isSubmitting ? "Updating..." : "Update Package"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => navigate("/manage-packages")}
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
