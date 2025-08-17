import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { bookingId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/${bookingId}?email=${userEmail}`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const price = booking.price;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (booking.status === "rejected") {
      return toast.info("Tour guide reject this booking");
    }

    if (booking.status === "cancelled") {
      return toast.info("You cancelled this booking");
    }

    if (booking.payment_status === "paid") {
      return toast.info("You already pay for this booking");
    }

    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    const { error: paymentMethodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      setLoading(false);
      return;
    }

    setError("");

    try {
      const res = await axiosSecure.post(
        `/create-payment-intent?email=${userEmail}`,
        { price }
      );
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName,
            email: userEmail,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const transactionId = result.paymentIntent.id;
        const paymentData = {
          bookingId,
          email: userEmail,
          price,
          transactionId,
          paymentMethod: result.paymentIntent.payment_method_types,
        };

        const paymentRes = await axiosSecure.post(
          `/payments?email=${userEmail}`,
          paymentData
        );

        if (paymentRes.data.insertedId && paymentRes.data.updatedBooking) {
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
            confirmButtonText: "Go to My Bookings",
          });

          navigate("/dashboard/myBookings");
        } else {
          setError("Payment saved but booking status not updated.");
        }
      }
    } catch (err) {
      setError(`Payment failed. Please try again. Reason: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-4">
        Payment for {booking.packageName}
      </h2>

      <div className="max-w-lg mx-auto">
        <form
          onSubmit={handlePay}
          className="rounded-xl space-y-4 bg-white p-6 shadow-md"
        >
          <CardElement className="p-2 border rounded" />
          {error && (
            <p className="text-sm text-red-500 font-medium mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary text-white w-full mt-4"
            disabled={!stripe || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md text-primary"></span>
            ) : (
              `Pay ৳${price}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
