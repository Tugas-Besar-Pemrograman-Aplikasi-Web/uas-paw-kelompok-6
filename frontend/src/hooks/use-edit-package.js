import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import * as packageService from "@/services/package.service";
import * as destinationService from "@/services/destination.service";

export function useEditPackage({
  id,
  user,
  isAuthenticated,
  navigate,
  validate,
  resetImages,
  images,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pkg, setPkg] = useState(null);
  const [destinations, setDestinations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    destinationId: "",
    duration: "",
    price: "",
    itinerary: "",
    maxTravelers: "",
    contactPhone: "",
  });

  // ===== FETCH DATA =====
  const fetchData = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [packageData, destinationsData] = await Promise.all([
        packageService.getPackageById(id),
        destinationService.getAllDestinations(),
      ]);

      // Permission check
      if (packageData.agentId !== user.id) {
        toast.error("You don't have permission to edit this package");
        navigate("/manage-packages");
        return;
      }

      setPkg(packageData);
      setDestinations(destinationsData);

      setFormData({
        name: packageData.name,
        destinationId: packageData.destinationId,
        duration: String(packageData.duration),
        price: String(packageData.price),
        itinerary: packageData.itinerary,
        maxTravelers: String(packageData.maxTravelers),
        contactPhone: packageData.contactPhone || "",
      });

      resetImages(
        packageData.images?.length ? packageData.images : [""]
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load package");
      navigate("/manage-packages");
    } finally {
      setIsLoading(false);
    }
  }, [id, user.id, navigate, resetImages]);

  // ===== AUTH + FETCH =====
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "agent") {
      navigate("/sign-in");
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate, fetchData]);

  // ===== FORM =====
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===== SUBMIT =====
  const submit = async () => {
    const payload = {
      ...formData,
      duration: Number(formData.duration),
      price: Number(formData.price),
      maxTravelers: Number(formData.maxTravelers),
      images: images.filter((img) => img.trim() !== ""),
    };

    if (!validate(payload)) return;

    setIsSubmitting(true);
    try {
      await packageService.updatePackage(id, {
        name: payload.name,
        duration: payload.duration,
        price: payload.price,
        itinerary: payload.itinerary,
        maxTravelers: payload.maxTravelers,
        contactPhone: payload.contactPhone,
        images: payload.images,
      });

      toast.success("Package updated successfully!");
      navigate("/manage-packages");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // state
    isLoading,
    isSubmitting,
    pkg,
    destinations,
    formData,

    // actions
    updateField,
    submit,
  };
}
