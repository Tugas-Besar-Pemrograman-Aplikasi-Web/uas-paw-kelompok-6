import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import * as destinationService from "@/services/destination.service";

export function useEditDestination({
  id,
  user,
  isAuthenticated,
  navigate,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    photo_url: "",
  });

  // ===== FETCH DESTINATION =====
  const fetchDestination = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await destinationService.getDestinationById(id);
      setFormData({
        name: data.name ?? "",
        country: data.country ?? "",
        description: data.description ?? "",
        photo_url: data.photo_url ?? "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Destination not found");
      navigate("/manage-destinations");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  // ===== AUTH + FETCH =====
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "agent") {
      navigate("/sign-in");
      return;
    }
    fetchDestination();
  }, [isAuthenticated, user, navigate, fetchDestination]);

  // ===== FORM HANDLERS =====
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===== SUBMIT =====
  const submit = async () => {
    if (!formData.name || !formData.country) {
      toast.error("Name and country are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await destinationService.updateDestination(id, {
        name: formData.name.trim(),
        country: formData.country.trim(),
        description: formData.description.trim(),
        photo_url: formData.photo_url.trim(),
      });

      toast.success("Destination updated successfully!");
      navigate("/manage-destinations");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to update destination"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // state
    isLoading,
    isSubmitting,
    formData,

    // actions
    updateField,
    submit,
  };
}
