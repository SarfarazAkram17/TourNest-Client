import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
  useDocumentTitle("Checkout");
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
