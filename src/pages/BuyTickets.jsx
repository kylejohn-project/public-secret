import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TicketSelector from "../components/TicketSelector";
import PaymentSection from "../components/PaymentSection";

const TICKET_PRICE = 555;
const MAX_TICKETS = 10;

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const SUBMISSION_ID_KEY = "ps001_submission_id";

/**
 * Returns the ID for the current checkout attempt.
 *
 * The same ID survives a normal page refresh,
 * allowing the backend to recognize a retry.
 */
function getSubmissionId() {
  let submissionId =
    sessionStorage.getItem(SUBMISSION_ID_KEY);

  if (!submissionId) {
    submissionId = crypto.randomUUID();

    sessionStorage.setItem(
      SUBMISSION_ID_KEY,
      submissionId
    );
  }

  return submissionId;
}

export default function BuyTickets() {
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  const [receipt, setReceipt] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const freeTickets = useMemo(() => {
    return Math.floor(quantity / 5);
  }, [quantity]);

  const totalTickets = quantity + freeTickets;

  const totalAmount = useMemo(() => {
    return quantity * TICKET_PRICE;
  }, [quantity]);

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(current + 1, MAX_TICKETS)
    );
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleReceiptChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setReceipt(file);
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          reject(new Error("Unable to read receipt."));
          return;
        }

        const base64 = result.split(",")[1];

        resolve(base64);
      };

      reader.onerror = () => {
        reject(new Error("Unable to read receipt."));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    /*
    * Extra protection against repeated submission.
    */
    if (submitting) {
      return;
    }

    setError("");

    if (!API_URL) {
      setError(
        "The order system is not configured yet. Please try again later."
      );

      return;
    }

    if (!receipt) {
      setError("Please upload your payment receipt.");

      return;
    }

    try {
      setSubmitting(true);

      const receiptBase64 = await fileToBase64(receipt);

      const payload = {
        action: "createOrder",

        /*
        * Idempotency key.
        *
        * Retrying this checkout will send
        * the same ID.
        */
        submissionId: getSubmissionId(),

        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),

        ticketType:
          quantity >= 5 ? "Bundled" : "Standard",

        quantity,

        receipt: {
          fileName: receipt.name,
          mimeType:
            receipt.type ||
            "application/octet-stream",
          base64: receiptBase64,
        },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Unable to submit order."
        );
      }

      /*
      * The server has confirmed that this checkout
      * has an order.
      *
      * We can now clear the idempotency key so a
      * future checkout receives a new one.
      */
      sessionStorage.removeItem(
        SUBMISSION_ID_KEY
      );

      setSubmitted(true);

    } catch (submitError) {
      console.error(submitError);

      setError(
        submitError.message ||
          "Something went wrong while submitting your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
          <div className="w-full border border-white/10 p-8 md:p-16">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
              Order Received
            </p>

            <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
              Thank
              <br />
              You.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
              Your order has been submitted successfully.
              We will verify your payment and email your tickets
              once the payment has been confirmed.
            </p>

            <div className="mt-10 border-y border-white/10 py-6">

              <div className="flex justify-between">
                <span className="text-white/40">
                  Paid Tickets
                </span>

                <span className="font-bold">
                  {quantity}
                </span>
              </div>

              {freeTickets > 0 && (
                <div className="mt-4 flex justify-between">
                  <span className="text-white/40">
                    Free Tickets
                  </span>

                  <span className="font-bold text-ps-red">
                    {freeTickets}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between">
                <span className="text-white/40">
                  Total Tickets
                </span>

                <span className="font-bold">
                  {totalTickets}
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-white/40">
                  Total
                </span>

                <span className="font-bold">
                  ₱{totalAmount.toLocaleString()}
                </span>
              </div>

            </div>

            <Link
              to="/"
              className="btn mt-10 rounded-none border-0 bg-white px-8 text-black hover:bg-neutral-200"
            >
              BACK TO HOME
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-16">

          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
          >
            ← Public Secret 001
          </Link>

          <h1 className="mt-8 text-6xl font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl">
            Buy
            <br />
            Tickets
          </h1>

        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-16 lg:grid-cols-[1fr_420px]">

            {/* LEFT */}
            <div>

              {/* STEP 01 */}
              <section>
                <div className="mb-8 flex items-center gap-4">

                  <span className="text-xs font-bold text-white/30">
                    01
                  </span>

                  <h2 className="text-sm font-bold uppercase tracking-[0.25em]">
                    Select Tickets
                  </h2>

                </div>

                <TicketSelector
                  quantity={quantity}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                />
              </section>


              {/* STEP 02 */}
              <section className="mt-16">

                <div className="mb-8 flex items-center gap-4">

                  <span className="text-xs font-bold text-white/30">
                    02
                  </span>

                  <h2 className="text-sm font-bold uppercase tracking-[0.25em]">
                    Your Information
                  </h2>

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                      First Name *
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white outline-none focus:border-white"
                      placeholder="Juan"
                    />
                  </div>


                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                      Last Name *
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white outline-none focus:border-white"
                      placeholder="Dela Cruz"
                    />
                  </div>


                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white outline-none focus:border-white"
                      placeholder="you@email.com"
                    />
                  </div>


                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                      Contact Number *
                    </label>

                    <input
                      type="tel"
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      required
                      className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white outline-none focus:border-white"
                      placeholder="09171234567"
                    />
                  </div>

                </div>

              </section>


              {/* STEP 03 */}
              <section className="mt-16">

                <div className="mb-8 flex items-center gap-4">

                  <span className="text-xs font-bold text-white/30">
                    03
                  </span>

                  <h2 className="text-sm font-bold uppercase tracking-[0.25em]">
                    Payment
                  </h2>

                </div>

                <PaymentSection
                  totalAmount={totalAmount}
                  receipt={receipt}
                  onReceiptChange={handleReceiptChange}
                />

              </section>

            </div>


            {/* RIGHT SUMMARY */}
            <aside className="lg:sticky lg:top-28 lg:h-fit">

              <div className="border border-white/10 bg-white/[0.03] p-6 md:p-8">

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                  Order Summary
                </p>

                <div className="mt-8 space-y-5">

                  <div className="flex justify-between">
                    <span className="text-sm text-white/50">
                      General Admission
                    </span>

                    <span className="text-sm font-bold">
                      × {quantity}
                    </span>
                  </div>


                  <div className="flex justify-between border-b border-white/10 pb-5">

                    <span className="text-sm text-white/50">
                      Price
                    </span>

                    <span className="text-sm font-bold">
                      ₱{TICKET_PRICE.toLocaleString()}
                    </span>

                  </div>


                  {freeTickets > 0 && (
                    <div className="flex justify-between">

                      <span className="text-sm text-white/50">
                        Free Tickets
                      </span>

                      <span className="text-sm font-bold text-ps-red">
                        + {freeTickets}
                      </span>

                    </div>
                  )}


                  <div className="flex justify-between">

                    <span className="text-sm text-white/50">
                      Total Tickets
                    </span>

                    <span className="text-sm font-bold">
                      {totalTickets}
                    </span>

                  </div>


                  <div className="flex items-end justify-between pt-2">

                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Total
                    </span>

                    <span className="text-3xl font-black">
                      ₱{totalAmount.toLocaleString()}
                    </span>

                  </div>

                </div>


                {error && (
                  <div className="mt-6 border border-red-500/20 bg-red-500/5 p-4">

                    <p className="text-sm leading-relaxed text-red-400">
                      {error}
                    </p>

                  </div>
                )}


                <button
                  type="submit"
                  disabled={submitting}
                  className="btn mt-8 h-14 w-full rounded-none border-0 bg-white text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      SUBMIT ORDER
                      <span>↗</span>
                    </>
                  )}
                </button>


                <p className="mt-5 text-center text-xs leading-relaxed text-white/30">
                  By submitting this order, you confirm that
                  the information provided is correct.
                </p>

              </div>

            </aside>

          </div>
        </form>

      </div>
    </main>
  );
}