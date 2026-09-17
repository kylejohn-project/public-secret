const TICKET_PRICE = 555;
const MAX_TICKETS = 10;

export default function TicketSelector({
  quantity,
  onIncrease,
  onDecrease,
}) {
  const freeTickets = Math.floor(quantity / 5);
  const totalTickets = quantity + freeTickets;
  const totalAmount = quantity * TICKET_PRICE;

  return (
    <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xl font-bold">
            General Admission
          </p>

          <p className="mt-2 text-sm text-white/40">
            Inclusive of 1 cocktail drink per ticket
          </p>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ps-red">
                Bundle Offer
              </p>

              <p className="mt-1 text-sm text-white/50">
                Buy 5 tickets and get{" "}
                <span className="font-bold text-white">
                  1 free
                </span>
              </p>
            </div>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">

          <div className="flex items-center gap-5">
            <p className="text-xl font-bold">
              ₱{TICKET_PRICE}
            </p>

            <div className="flex items-center border border-white/20">
              <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                −
              </button>

              <span className="flex h-11 w-12 items-center justify-center border-x border-white/20 text-sm font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= MAX_TICKETS}
                className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right text-xs text-white/40">
            <p>
              Paid tickets:{" "}
              <span className="text-white">
                {quantity}
              </span>
            </p>

            {freeTickets > 0 && (
              <p className="mt-1 text-ps-red">
                Free tickets: {freeTickets}
              </p>
            )}

            <p className="mt-1">
              Total tickets:{" "}
              <span className="text-white">
                {totalTickets}
              </span>
            </p>

            <p className="mt-1">
              Total:{" "}
              <span className="font-bold text-white">
                ₱{totalAmount.toLocaleString()}
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}