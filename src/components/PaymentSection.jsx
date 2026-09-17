export default function PaymentSection({
  totalAmount,
  receipt,
  onReceiptChange,
}) {
  return (
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
              onChange={onReceiptChange}
              className="file-input file-input-bordered w-full rounded-none border-white/10 bg-white/[0.03] text-sm"
            />

            {receipt && (
              <p className="mt-3 break-all text-xs text-white/50">
                Selected: {receipt.name}
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}