import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import { confirmAction, getErrorMessage } from "../utils/alerts";

/**
 * Booking state changes shared by every screen (tourist cancel, guide accept / decline).
 * The server enforces the real rules; this hook adds confirmations and cache refreshes.
 */
const useBookingActions = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState(null);

  const refresh = () => {
    ["myBookings", "assignedTours", "tourGuideStats", "touristStats", "adminStats", "booking"].forEach(
      (key) => queryClient.invalidateQueries({ queryKey: [key] })
    );
  };

  const change = async (id, status, successMessage) => {
    setBusyId(id);
    try {
      await axiosSecure.patch(`/bookings/${id}?email=${userEmail}`, { status });
      toast.success(successMessage);
      refresh();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't update this booking."));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const accept = async (booking) => {
    const ok = await confirmAction({
      title: "Accept this tour?",
      text: `${booking.touristName} will be notified that ${booking.packageName} is confirmed.`,
      confirmText: "Accept tour",
    });
    return ok ? change(booking._id, "accepted", "Tour accepted. The traveler can see it as confirmed.") : false;
  };

  const reject = async (booking) => {
    const paid = booking.payment_status === "paid";
    const ok = await confirmAction({
      title: "Decline this tour?",
      text: paid
        ? "The traveler has already paid, so their payment will be refunded in full."
        : "The traveler will be told you can't take this booking.",
      confirmText: "Decline tour",
      icon: "warning",
      danger: true,
    });
    return ok
      ? change(booking._id, "rejected", paid ? "Tour declined and payment refunded." : "Tour declined.")
      : false;
  };

  const cancel = async (booking) => {
    const paid = booking.payment_status === "paid";
    const ok = await confirmAction({
      title: "Cancel this booking?",
      text: paid
        ? "Your payment will be refunded to your card in full."
        : "This booking will be cancelled. You can always book again later.",
      confirmText: "Cancel booking",
      cancelText: "Keep booking",
      icon: "warning",
      danger: true,
    });
    return ok
      ? change(booking._id, "cancelled", paid ? "Booking cancelled and refunded." : "Booking cancelled.")
      : false;
  };

  return { accept, reject, cancel, busyId };
};

export default useBookingActions;
