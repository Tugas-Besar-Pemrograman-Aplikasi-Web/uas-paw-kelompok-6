import { useMutations } from "./use-mutation";
import { uploadPaymentProof, verifyPayment, rejectPayment } from "@/services/payment.service";

/**
 * Hook untuk operasi mutasi payment (upload, verify, reject)
 */
export function usePaymentMutation() {
  const { upload, verify, reject, isLoading, error } = useMutations({
    upload: {
      fn: (bookingId, file) => uploadPaymentProof(bookingId, file),
      options: { errorMessage: "Gagal mengupload bukti pembayaran" },
    },
    verify: {
      fn: verifyPayment,
      options: { errorMessage: "Gagal memverifikasi payment" },
    },
    reject: {
      fn: (bookingId, reason) => rejectPayment(bookingId, reason),
      options: { errorMessage: "Gagal menolak payment" },
    },
  });

  return { upload, verify, reject, isLoading, error };
}
