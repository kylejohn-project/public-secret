import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearAdminSession,
  getAdminToken,
} from "../../services/adminAuth";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const ORDERS_PER_PAGE = 10;

export default function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] =
    useState(null);

  const [error, setError] = useState("");

  // Filters
  const [activeTab, setActiveTab] =
    useState("pending");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  // Reset pagination whenever the user
  // changes tab or search.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  function handleUnauthorized() {
    clearAdminSession();

    navigate("/admin/login", {
      replace: true,
    });
  }

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}?action=adminOrders&token=${encodeURIComponent(
          token
        )}`
      );

      const result = await response.json();

      if (!result.success) {
        if (result.message === "UNAUTHORIZED") {
          handleUnauthorized();
          return;
        }

        throw new Error(
          result.message ||
            "Unable to load orders."
        );
      }

      setOrders(result.orders || []);
    } catch (error) {
      console.error("Orders error:", error);

      setError(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  async function postAction(
    action,
    orderId
  ) {
    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();

      throw new Error(
        "Admin session expired."
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8",
      },

      body: JSON.stringify({
        action,
        orderId,
        token,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      if (result.message === "UNAUTHORIZED") {
        handleUnauthorized();

        throw new Error(
          "Admin session expired."
        );
      }

      throw new Error(
        result.message || "Request failed."
      );
    }

    return result;
  }

  async function handleVerify(order) {
    const confirmed = window.confirm(
      `Verify payment for ${order.firstName} ${order.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrder(order.orderId);

      await postAction(
        "verifyOrder",
        order.orderId
      );

      await loadOrders();
    } catch (error) {
      console.error(
        "Verify order error:",
        error
      );

      alert(error.message);
    } finally {
      setProcessingOrder(null);
    }
  }

  async function handleGenerate(order) {
    const confirmed = window.confirm(
      `Generate ${order.quantity} ticket(s) for ${order.firstName} ${order.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrder(order.orderId);

      const result = await postAction(
        "generateTickets",
        order.orderId
      );

      alert(result.message);

      await loadOrders();
    } catch (error) {
      console.error(
        "Generate tickets error:",
        error
      );

      alert(error.message);
    } finally {
      setProcessingOrder(null);
    }
  }

  async function handleSendEmail(order) {
    const alreadySent =
      Number(order.emailSendCount) > 0;

    const confirmed =
      window.confirm(
        alreadySent
          ? `Resend ticket to ${order.email}?`
          : `Send ticket to ${order.email}?`
      );


    if (!confirmed) {
      return;
    }


    try {
      setProcessingOrder(
        order.orderId
      );


      const result =
        await postAction(
          "sendTicketEmail",
          order.orderId
        );


      alert(
        result.message
      );


      await loadOrders();

    } catch (error) {

      console.error(
        "Send ticket email error:",
        error
      );


      alert(
        error.message
      );

    } finally {

      setProcessingOrder(null);

    }
}

  // ========================================
  // ORDER COUNTS
  // ========================================

  const pendingCount = useMemo(() => {
    return orders.filter(
      (order) =>
        order.paymentStatus !== "VERIFIED" ||
        order.ticketStatus !== "GENERATED"
    ).length;
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter(
      (order) =>
        order.paymentStatus === "VERIFIED" &&
        order.ticketStatus === "GENERATED"
    ).length;
  }, [orders]);

  // ========================================
  // FILTERING
  // ========================================

  const filteredOrders = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      // TAB FILTER
      const isCompleted =
        order.paymentStatus === "VERIFIED" &&
        order.ticketStatus === "GENERATED";

      const matchesTab =
        activeTab === "completed"
          ? isCompleted
          : !isCompleted;

      if (!matchesTab) {
        return false;
      }

      // SEARCH FILTER
      if (!search) {
        return true;
      }

      const fullName =
        `${order.firstName || ""} ${
          order.lastName || ""
        }`.toLowerCase();

      const orderId = String(
        order.orderId || ""
      ).toLowerCase();

      return (
        fullName.includes(search) ||
        orderId.includes(search)
      );
    });
  }, [
    orders,
    activeTab,
    searchTerm,
  ]);

  // ========================================
  // PAGINATION
  // ========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ORDERS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    ORDERS_PER_PAGE;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE
    );

  const firstVisibleOrder =
    filteredOrders.length === 0
      ? 0
      : startIndex + 1;

  const lastVisibleOrder = Math.min(
    startIndex + ORDERS_PER_PAGE,
    filteredOrders.length
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <p className="text-white/40">
          Loading orders...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-brand">
            Public Secret 001
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">
            Orders
          </h1>

          <p className="mt-4 text-sm text-white/40">
            Verify payments and generate tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="btn rounded-none border border-white/10 bg-transparent text-xs text-white hover:border-ps-brand hover:bg-ps-brand-soft"
        >
          REFRESH
        </button>
      </section>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-10 border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ========================================
          TABS
      ======================================== */}

      <section className="mt-12 border-b border-white/10">
        <div className="flex gap-8">

          <TabButton
            active={activeTab === "pending"}
            onClick={() =>
              setActiveTab("pending")
            }
            label="Pending"
            count={pendingCount}
          />

          <TabButton
            active={
              activeTab === "completed"
            }
            onClick={() =>
              setActiveTab("completed")
            }
            label="Completed"
            count={completedCount}
          />

        </div>
      </section>

      {/* ========================================
          SEARCH
      ======================================== */}

      <section className="mt-8">
        <div className="relative max-w-xl">

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search name or Order ID..."
            className="
              h-14
              w-full
              rounded-none
              border
              border-white/10
              bg-white/[0.03]
              px-5
              pr-24
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-ps-brand
            "
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm("")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
            >
              Clear
            </button>
          )}

        </div>

        <p className="mt-3 text-xs text-white/25">
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1
            ? "order"
            : "orders"}{" "}
          found
        </p>
      </section>

      {/* ========================================
          ORDERS
      ======================================== */}

      <section className="mt-8 space-y-3">

        {paginatedOrders.length === 0 && (
          <div className="border border-white/10 p-12 text-center">

            <p className="text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              No orders found
            </p>

            <p className="mt-2 text-xs text-white/20">
              {searchTerm
                ? "Try another name or Order ID."
                : activeTab === "pending"
                  ? "There are no pending orders."
                  : "There are no completed orders."}
            </p>

          </div>
        )}

        {paginatedOrders.map(
          (order) => {
            const processing =
              processingOrder ===
              order.orderId;

            const receiptUrl =
              order.receiptFileId
                ? `https://drive.google.com/file/d/${order.receiptFileId}/view`
                : null;

            const ticketUrl =
              order.ticketPdfFileId
                ? `https://drive.google.com/file/d/${order.ticketPdfFileId}/view`
                : null;

            return (
              <article
                key={order.orderId}
                className="border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 md:p-8"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                  {/* CUSTOMER */}

                  <div className="min-w-0 lg:w-[280px]">

                    <div className="flex flex-wrap items-center gap-3">

                      <p className="text-xl font-black uppercase">
                        {order.firstName}{" "}
                        {order.lastName}
                      </p>

                      <StatusBadge
                        value={
                          order.paymentStatus
                        }
                      />

                    </div>

                    <p className="mt-2 break-all font-mono text-xs text-white/30">
                      {order.orderId}
                    </p>

                    <div className="mt-5 grid gap-2 text-sm text-white/50">
                      <p className="break-all">
                        {order.email}
                      </p>

                      <p>
                        {
                          order.contactNumber
                        }
                      </p>

                      {Number(order.emailSendCount) > 0 && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-400/70">
                          EMAIL SENT ·{" "}
                          {order.emailSendCount}×
                        </p>
                      )}
                    </div>

                  </div>

                  {/* ORDER DETAILS */}

                  <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">

                    <OrderValue
                      label="Paid"
                      value={
                        order.paidTickets
                      }
                    />

                    <OrderValue
                      label="Free"
                      value={
                        order.freeTickets
                      }
                    />

                    <OrderValue
                      label="Total Tickets"
                      value={order.quantity}
                    />

                    <OrderValue
                      label="Amount"
                      value={`₱${Number(
                        order.totalAmount
                      ).toLocaleString()}`}
                    />

                  </div>

                  {/* ACTIONS */}

                  <div className="flex min-w-[190px] flex-col gap-2">

                    {/* PENDING / PROCESSING ORDER */}
                    {order.ticketStatus !== "GENERATED" &&
                      (receiptUrl ? (
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn h-11 rounded-none border border-white/10 bg-transparent text-xs text-white hover:border-white/30"
                        >
                          VIEW RECEIPT ↗
                        </a>
                      ) : (
                        <div className="border border-white/10 px-4 py-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            No Receipt
                          </p>
                        </div>
                      ))}


                    {/* COMPLETED ORDER */}
                    {order.ticketStatus === "GENERATED" &&
                      (ticketUrl ? (
                        <a
                          href={ticketUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn h-11 rounded-none border border-ps-brand bg-ps-brand-soft text-xs text-ps-brand hover:bg-ps-brand hover:text-white"
                        >
                          VIEW TICKET ↗
                        </a>
                      ) : (
                        <div className="border border-white/10 px-4 py-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            Ticket PDF unavailable
                          </p>
                        </div>
                      ))}

                      {/* SEND / RESEND EMAIL */}
                      {order.ticketStatus ===
                        "GENERATED" && (
                        <button
                          type="button"

                          disabled={
                            processing ||
                            !order.ticketPdfFileId
                          }

                          onClick={() =>
                            handleSendEmail(order)
                          }

                          className="
                            btn
                            h-11
                            rounded-none
                            border-0
                            bg-white
                            text-xs
                            font-bold
                            text-black
                            hover:bg-neutral-200
                            disabled:opacity-40
                          "
                        >

                          {processing
                            ? "SENDING..."
                            : Number(
                                  order.emailSendCount
                                ) > 0
                              ? "RESEND EMAIL"
                              : "SEND TO EMAIL"}

                        </button>
                      )}

                    {order.paymentStatus ===
                      "PENDING" && (
                      <button
                        type="button"
                        disabled={
                          processing
                        }
                        onClick={() =>
                          handleVerify(
                            order
                          )
                        }
                        className="btn h-11 rounded-none border-0 bg-ps-brand text-xs text-white hover:bg-ps-brand-hover disabled:opacity-40"
                      >
                        {processing
                          ? "VERIFYING..."
                          : "VERIFY PAYMENT"}
                      </button>
                    )}

                    {order.paymentStatus ===
                      "VERIFIED" &&
                      order.ticketStatus !==
                        "GENERATED" && (
                        <button
                          type="button"
                          disabled={
                            processing
                          }
                          onClick={() =>
                            handleGenerate(
                              order
                            )
                          }
                          className="btn h-11 rounded-none border-0 bg-white text-xs text-black hover:bg-neutral-200 disabled:opacity-40"
                        >
                          {processing
                            ? "GENERATING..."
                            : "GENERATE TICKETS"}
                        </button>
                      )}

                    {order.ticketStatus ===
                      "GENERATED" && (
                      <div className="border border-green-500/20 bg-green-500/5 px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                          Tickets Generated
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              </article>
            );
          }
        )}

      </section>

      {/* ========================================
          PAGINATION
      ======================================== */}

      {filteredOrders.length > 0 && (
        <section className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/30">
            Showing{" "}
            <span className="text-white/60">
              {firstVisibleOrder}
            </span>
            {" – "}
            <span className="text-white/60">
              {lastVisibleOrder}
            </span>
            {" of "}
            <span className="text-white/60">
              {filteredOrders.length}
            </span>
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              className="btn h-10 min-h-0 rounded-none border border-white/10 bg-transparent px-4 text-[10px] font-bold text-white hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-20"
            >
              ← PREV
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers(
                safeCurrentPage,
                totalPages
              ).map(
                (page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-10 w-8 items-center justify-center text-xs text-white/30"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`h-10 min-w-10 border px-3 text-xs font-bold transition ${
                        safeCurrentPage ===
                        page
                          ? "border-ps-brand bg-ps-brand text-white"
                          : "border-white/10 bg-transparent text-white/40 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
              )}
            </div>

            <button
              type="button"
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              className="btn h-10 min-h-0 rounded-none border border-white/10 bg-transparent px-4 text-[10px] font-bold text-white hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-20"
            >
              NEXT →
            </button>

          </div>

        </section>
      )}

    </main>
  );
}


// ========================================
// TAB BUTTON
// ========================================

function TabButton({
  active,
  onClick,
  label,
  count,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-5 text-xs font-bold uppercase tracking-[0.2em] transition ${
        active
          ? "text-white"
          : "text-white/30 hover:text-white/60"
      }`}
    >
      <span className="flex items-center gap-2">

        {label}

        <span
          className={`flex min-w-6 items-center justify-center px-1.5 py-0.5 text-[9px] ${
            active
              ? "bg-ps-brand text-white"
              : "bg-white/5 text-white/30"
          }`}
        >
          {count}
        </span>

      </span>

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-ps-brand" />
      )}

    </button>
  );
}


// ========================================
// ORDER VALUE
// ========================================

function OrderValue({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}


// ========================================
// STATUS BADGE
// ========================================

function StatusBadge({ value }) {
  const verified =
    value === "VERIFIED";

  return (
    <span
      className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${
        verified
          ? "border-green-500/20 bg-green-500/5 text-green-400"
          : "border-ps-brand-border bg-ps-brand-soft text-ps-brand"
      }`}
    >
      {value}
    </span>
  );
}


// ========================================
// PAGINATION NUMBERS
// ========================================

function getPageNumbers(
  currentPage,
  totalPages
) {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      4,
      "...",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 2
  ) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}