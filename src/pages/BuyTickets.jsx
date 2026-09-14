import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const TICKET_PRICE = 555;
const MAX_TICKETS = 10;

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

  const totalAmount = useMemo(() => {
    return quantity * TICKET_PRICE;
  }, [quantity]);

  function increaseQuantity() {
    setQuantity((current) =>
      current + 1
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

  function handleSubmit(event) {
    event.preventDefault();

    // Temporary frontend-only submission.
    // This will later call the Vercel / Apps Script API.

    console.log({
      ...form,
      ticketType: "GENERAL",
      quantity,
      totalAmount,
      receipt,
    });

    setSubmitted(true);
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
                  Tickets
                </span>

                <span className="font-bold">
                  {quantity}
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

                <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xl font-bold">
                        General Admission
                      </p>

                      <p className="mt-2 text-sm text-white/40">
                        Entry to Public Secret 001
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <p className="text-xl font-bold">
                        ₱{TICKET_PRICE}
                      </p>

                      <div className="flex items-center border border-white/20">
                        <button
                          type="button"
                          onClick={decreaseQuantity}
                          className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-white hover:text-black"
                        >
                          −
                        </button>

                        <span className="flex h-11 w-12 items-center justify-center border-x border-white/20 text-sm font-bold">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={increaseQuantity}
                          className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-white hover:text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
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

                <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">

                  <div className="grid gap-10 md:grid-cols-2">

                    {/* QR */}
                    <div>
                      <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                        Scan to Pay
                      </p>

                    <div className="max-w-[280px] bg-white p-5">
                        <img
                            src="/Unknown-3.jpg"
                            alt="Payment QR Code"
                            className="aspect-square w-full object-contain"
                        />
                    </div>

                      <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/40">
                        Scan the QR code using your preferred
                        payment method and complete the payment.
                      </p>
                    </div>

                    {/* Payment info */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                        Payment Details
                      </p>

                      <div className="mt-5 space-y-4 text-sm">
                        <div className="flex justify-between gap-5 border-b border-white/10 pb-4">
                          <span className="text-white/40">
                            Account
                          </span>

                          <span className="text-right font-bold">
                            PUBLIC SECRET
                          </span>
                        </div>

                        <div className="flex justify-between gap-5 border-b border-white/10 pb-4">
                          <span className="text-white/40">
                            Amount
                          </span>

                          <span className="font-bold">
                            ₱{totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                          Payment Receipt *
                        </label>

                        <input
                          type="file"
                          accept="image/*,.pdf"
                          required
                          onChange={handleReceiptChange}
                          className="file-input file-input-bordered w-full rounded-none border-white/10 bg-white/[0.03] text-sm"
                        />

                        {receipt && (
                          <p className="mt-3 text-xs text-white/50">
                            Selected: {receipt.name}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
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

                  <div className="flex items-end justify-between pt-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Total
                    </span>

                    <span className="text-3xl font-black">
                      ₱{totalAmount.toLocaleString()}
                    </span>
                  </div>

                </div>

                <button
                  type="submit"
                  className="btn mt-8 h-14 w-full rounded-none border-0 bg-white text-black hover:bg-neutral-200"
                >
                  SUBMIT ORDER
                  <span>↗</span>
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