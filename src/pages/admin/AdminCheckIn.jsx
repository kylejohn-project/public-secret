import {
  useState,
} from "react";

import {
  getAdminToken,
} from "../../services/adminAuth";


const API_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL;


export default function AdminCheckIn() {
  const [ticketId, setTicketId] =
    useState("");

  const [ticket, setTicket] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  async function handleSearch(event) {
    event.preventDefault();

    const normalized =
      ticketId
        .trim()
        .toUpperCase();

    if (!normalized) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setTicket(null);

      const token =
        getAdminToken();

      const response =
        await fetch(
          `${API_URL}?action=getTicket&ticketId=${encodeURIComponent(
            normalized
          )}&token=${encodeURIComponent(
            token
          )}`
        );

      const result =
        await response.json();


      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to find ticket."
        );
      }


      if (!result.found) {
        throw new Error(
          "Ticket not found."
        );
      }


      setTicket(result.ticket);

    } catch (error) {
      setError(
        error.message ||
          "Unable to find ticket."
      );

    } finally {
      setLoading(false);
    }
  }


  async function handleCheckIn() {
    if (!ticket) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token =
        getAdminToken();


      const response =
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8",
          },

          body: JSON.stringify({
            action: "checkInTicket",
            ticketId:
              ticket.ticketId,
            token,
          }),
        });


      const result =
        await response.json();


      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to check in ticket."
        );
      }


      setTicket(result.ticket);

      setSuccess(
        "Ticket checked in successfully."
      );

    } catch (error) {
      setError(
        error.message ||
          "Unable to check in ticket."
      );

    } finally {
      setLoading(false);
    }
  }


  function resetScanner() {
    setTicketId("");
    setTicket(null);
    setError("");
    setSuccess("");
  }


  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-20">

      <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
        Public Secret 001
      </p>

      <h1 className="mt-5 text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">
        Check In
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/40">
        Scan the ticket QR code or enter
        the Ticket ID manually.
      </p>


      {/* SEARCH */}

      <form
        onSubmit={handleSearch}
        className="mt-12 border border-white/10 bg-white/[0.02] p-6 md:p-8"
      >

        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
          Ticket ID
        </label>


        <div className="mt-4 flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={ticketId}
            onChange={(event) =>
              setTicketId(
                event.target.value
              )
            }
            autoFocus
            placeholder="PS001-TKT-..."
            className="input h-14 flex-1 rounded-none border-white/10 bg-white/[0.03] font-mono text-sm uppercase text-white focus:border-orange-600"
          />


          <button
            type="submit"
            disabled={loading}
            className="btn h-14 rounded-none border-0 bg-white px-8 text-xs text-black hover:bg-neutral-200"
          >
            {loading
              ? "SEARCHING..."
              : "VERIFY TICKET"}
          </button>

        </div>

      </form>


      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/5 p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
            Verification Failed
          </p>

          <p className="mt-2 text-sm text-red-300">
            {error}
          </p>

        </div>
      )}


      {success && (
        <div className="mt-6 border border-green-500/30 bg-green-500/5 p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
            Check-In Successful
          </p>

          <p className="mt-2 text-sm text-green-300">
            {success}
          </p>

        </div>
      )}


      {ticket && (
        <section className="mt-6 border border-white/10 bg-white/[0.02]">

          <div
            className={`border-b p-6 md:p-8 ${
              ticket.status ===
              "CHECKED_IN"
                ? "border-green-500/20 bg-green-500/5"
                : "border-orange-500/20 bg-orange-500/5"
            }`}
          >

            <p
              className={`text-xs font-black uppercase tracking-[0.3em] ${
                ticket.status ===
                "CHECKED_IN"
                  ? "text-green-400"
                  : "text-orange-400"
              }`}
            >
              {ticket.status ===
              "CHECKED_IN"
                ? "Already Checked In"
                : "Valid Ticket"}
            </p>

          </div>


          <div className="p-6 md:p-8">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Ticket Holder
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase">
              {ticket.customerName}
            </h2>


            <div className="mt-8 grid gap-6 border-y border-white/10 py-6 sm:grid-cols-2">

              <TicketDetail
                label="Ticket ID"
                value={ticket.ticketId}
              />

              <TicketDetail
                label="Ticket Type"
                value={ticket.ticketType}
              />

              <TicketDetail
                label="Order"
                value={ticket.orderId}
              />

              <TicketDetail
                label="Status"
                value={ticket.status}
              />

            </div>


            {ticket.status ===
            "GENERATED" ? (
              <button
                type="button"
                onClick={
                  handleCheckIn
                }
                disabled={loading}
                className="btn mt-8 h-16 w-full rounded-none border-0 bg-ps-red text-sm font-black text-white hover:bg-ps-red-hover"
              >
                CHECK IN TICKET
              </button>
            ) : (
              <div className="mt-8 border border-red-500/20 bg-red-500/5 p-5">

                <p className="text-sm font-bold text-red-400">
                  DO NOT ADMIT — this
                  ticket has already
                  been used.
                </p>

                {ticket.checkedInAt && (
                  <p className="mt-2 text-xs text-white/40">
                    Checked in:{" "}
                    {new Date(
                      ticket.checkedInAt
                    ).toLocaleString()}
                  </p>
                )}

              </div>
            )}


            <button
              type="button"
              onClick={resetScanner}
              className="btn mt-3 h-12 w-full rounded-none border border-white/10 bg-transparent text-xs text-white hover:bg-white/5"
            >
              NEXT TICKET
            </button>

          </div>

        </section>
      )}

    </main>
  );
}


function TicketDetail({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-2 break-all font-mono text-sm font-bold">
        {value || "—"}
      </p>
    </div>
  );
}