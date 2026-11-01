import { useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  LuArrowLeft,
  LuCalendarDays,
  LuCircleCheck,
  LuCircleX,
  LuLock,
  LuShieldCheck,
} from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useTheme from "../../../Hooks/useTheme";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Components/UI/PageHeader";
import Avatar from "../../../Components/UI/Avatar";
import EmptyState from "../../../Components/UI/EmptyState";
import { Badge } from "../../../Components/UI/StatusBadge";
import Loading from "../../../Components/Loading/Loading";
import { formatBDT, formatDate } from "../../../utils/format";
import { getErrorMessage } from "../../../utils/alerts";

const STATE_COPY = {
  paid: { title: "This booking is already paid", text: "Nothing more to do. Your guide will confirm soon.", ok: true },
  cancelled: { title: "This booking was cancelled", text: "Cancelled bookings can't be paid." },
  rejected: { title: "The guide declined this booking", text: "You were not charged. Choose another guide or date." },
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, userEmail } = useAuth();
  const { isDark } = useTheme();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { bookingId } = useParams();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [intent, setIntent] = useState(null); // paid at Stripe, still to be recorded
  const [receipt, setReceipt] = useState(null);

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => (await axiosSecure.get(`/bookings/${bookingId}?email=${userEmail}`)).data,
    enabled: !!userEmail,
    retry: false,
  });

  if (isLoading) return <Loading />;
  if (isError || !booking) {
    return (
      <EmptyState title="Booking not found" description="We couldn't find this booking under your account.">
        <Link to="/dashboard/myBookings" className="btn btn-primary">
          Go to my bookings
        </Link>
      </EmptyState>
    );
  }

  const blocked =
    booking.payment_status === "paid"
      ? STATE_COPY.paid
      : STATE_COPY[booking.status] || (booking.status !== "pending" ? STATE_COPY.paid : null);

  const recordPayment = async (transactionId) => {
    const res = await axiosSecure.post(`/payments?email=${userEmail}`, { bookingId, transactionId });
    if (res.data.insertedId) {
      setReceipt({ transactionId });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["touristStats"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      return;
    }
    throw new Error("The payment was taken but we couldn't update your booking.");
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      if (intent) {
        await recordPayment(intent);
        return;
      }

      if (!stripe || !elements) throw new Error("Payments are still loading. Try again in a moment.");
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("The card form isn't ready yet.");

      const res = await axiosSecure.post(`/create-payment-intent?email=${userEmail}`, { bookingId });

      const result = await stripe.confirmCardPayment(res.data.clientSecret, {
        payment_method: {
          card,
          billing_details: { name: user?.displayName, email: userEmail },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        setIntent(result.paymentIntent.id);
        await recordPayment(result.paymentIntent.id);
      } else {
        throw new Error("Your bank needs more time to confirm. Check My bookings in a minute.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Payment failed. Please try again."));
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: isDark ? "#e6eff0" : "#10242a",
        fontFamily: "Figtree, system-ui, sans-serif",
        fontSize: "16px",
        "::placeholder": { color: isDark ? "#8fa6ab" : "#6b7f85" },
        iconColor: isDark ? "#8fa6ab" : "#5d7279",
      },
      invalid: { color: isDark ? "#ff6b6b" : "#c62828", iconColor: isDark ? "#ff6b6b" : "#c62828" },
    },
    hidePostalCode: true,
  };

  if (receipt) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="surface p-6 text-center sm:p-10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/12 text-success">
            <LuCircleCheck size={34} aria-hidden="true" />
          </span>
          <h1 className="h-page mt-5">Payment received</h1>
          <p className="mt-2 text-muted">
            {booking.tourGuideName} has been notified and will confirm your trip to{" "}
            <strong className="text-base-content">{booking.packageName}</strong>. You can follow the
            status in My bookings.
          </p>
          <div className="mt-6 rounded-xl bg-base-200 p-4 text-left text-sm">
            <p className="text-xs text-muted">Transaction ID</p>
            <p className="break-all font-mono text-xs">{receipt.transactionId}</p>
            <p className="mt-3 text-xs text-muted">Amount paid</p>
            <p className="font-bold tabular-nums">{formatBDT(booking.price)}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard/myBookings" className="btn btn-primary">
              View my bookings
            </Link>
            <Link to="/allTrips" className="btn btn-outline">
              Explore more trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/dashboard/myBookings" className="btn btn-ghost btn-sm -ml-3 mb-2">
        <LuArrowLeft size={16} aria-hidden="true" /> My bookings
      </Link>
      <PageHeader title="Checkout" description="Review your trip and pay securely to notify your guide." />

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <section className="surface order-2 min-w-0 p-5 sm:p-6 lg:order-1" aria-label="Payment">
          {blocked ? (
            <div className="py-6 text-center">
              <span
                className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full ${
                  blocked.ok ? "bg-success/12 text-success" : "bg-error/12 text-error"
                }`}
              >
                {blocked.ok ? <LuCircleCheck size={28} /> : <LuCircleX size={28} />}
              </span>
              <h2 className="mt-4 text-lg font-bold">{blocked.title}</h2>
              <p className="mt-1 text-sm text-muted">{blocked.text}</p>
              <Link to="/dashboard/myBookings" className="btn btn-primary mt-6">
                Back to my bookings
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePay} noValidate>
              <h2 className="text-lg font-bold">Pay with card</h2>
              <p className="mt-1 text-sm text-muted">Your card details go straight to Stripe.</p>

              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-element">
                  Card details
                </label>
                <div
                  id="card-element"
                  className={`rounded-xl border bg-base-100 px-4 py-3.5 transition-colors ${
                    focused ? "border-primary outline-2 outline-primary/40" : "border-base-content/20"
                  } ${error && !intent ? "border-error" : ""}`}
                >
                  <CardElement
                    options={cardStyle}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(ev) => setCardComplete(ev.complete)}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  Testing? Use card 4242 4242 4242 4242 with any future date and CVC.
                </p>
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
                  {error}
                </p>
              )}
              {intent && (
                <p className="mt-4 rounded-xl bg-warning/10 px-4 py-3 text-sm text-warning">
                  Your card was charged. We're just finishing your booking update, so please press the
                  button again instead of paying twice.
                </p>
              )}

              <button
                type="submit"
                disabled={!stripe || processing || (!cardComplete && !intent)}
                className="btn btn-primary btn-lg mt-6 w-full"
              >
                {processing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <LuLock size={18} aria-hidden="true" />
                    {intent ? "Finish confirming" : `Pay ${formatBDT(booking.price)}`}
                  </>
                )}
              </button>

              <p className="mt-4 flex items-start gap-2 text-xs text-muted">
                <LuShieldCheck size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                Payments are encrypted and processed by Stripe. If your guide declines, or you cancel
                before confirmation, you're refunded in full.
              </p>
            </form>
          )}
        </section>

        <aside className="surface order-1 h-fit min-w-0 overflow-hidden lg:order-2" aria-label="Order summary">
          {booking.packageImage && (
            <img src={booking.packageImage} alt="" className="aspect-[16/9] w-full object-cover" />
          )}
          <div className="p-5">
            <h2 className="text-lg font-bold leading-snug">{booking.packageName}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <LuCalendarDays size={16} className="shrink-0 text-muted" aria-hidden="true" />
                <dt className="sr-only">Travel date</dt>
                <dd className="font-semibold">{formatDate(booking.tourDate, { weekday: "long" })}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={booking.tourGuideImage} name={booking.tourGuideName} size="xs" />
                <dt className="sr-only">Guide</dt>
                <dd className="min-w-0 truncate font-semibold">{booking.tourGuideName}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-2 border-t border-base-content/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Package price</span>
                <span className="tabular-nums">{formatBDT(booking.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Booking fee</span>
                <span className="tabular-nums">{formatBDT(0)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-base-content/10 pt-3 text-base">
                <span className="font-bold">Total</span>
                <span className="font-display text-xl font-bold tabular-nums">{formatBDT(booking.price)}</span>
              </div>
            </div>
            <div className="mt-4">
              <Badge tone={booking.payment_status === "paid" ? "success" : "warning"}>
                {booking.payment_status === "paid" ? "Paid" : "Awaiting payment"}
              </Badge>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentForm;
