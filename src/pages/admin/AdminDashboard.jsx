import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";

import {
  clearAdminSession,
  getAdminToken,
} from "../../services/adminAuth";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const EMPTY_DASHBOARD = {
  maxCapacity: 800,
  ticketsLeft: 800,
  paidTickets: 0,
  freeTickets: 0,
  pendingOrders: 0,
  totalTickets: 0,
  totalAmount: 0,
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleUnauthorized() {
    clearAdminSession();

    navigate("/admin/login", {
      replace: true,
    });
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}?action=adminDashboard&token=${encodeURIComponent(
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
          result.message || "Unable to load dashboard."
        );
      }

      if (!result.dashboard) {
        throw new Error(
          "Dashboard data was not returned by the API."
        );
      }

      setDashboard({
        ...EMPTY_DASHBOARD,
        ...result.dashboard,
      });
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <p className="text-sm text-white/40">
          Loading dashboard...
        </p>
      </main>
    );
  }

  const capacityPercentage =
    dashboard.maxCapacity > 0
      ? Math.min(
          (dashboard.totalTickets /
            dashboard.maxCapacity) *
            100,
          100
        )
      : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      {/* HEADER */}

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
          Public Secret 001
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">
              Dashboard
            </h1>

            <p className="mt-4 text-sm text-white/40">
              Event sales and ticket overview.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="btn rounded-none border border-white/10 bg-transparent text-xs text-white hover:border-orange-600 hover:bg-orange-950/20"
          >
            REFRESH
          </button>
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <div className="mt-10 border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* CAPACITY */}

      <section className="mt-14 border border-ps-red-border bg-ps-red-soft p-6 md:p-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ps-red">
              Event Capacity
            </p>

            <p className="mt-3 text-4xl font-black md:text-6xl">
              {dashboard.totalTickets}

              <span className="text-white/20">
                {" "}
                / {dashboard.maxCapacity}
              </span>
            </p>
          </div>

          <p className="text-right text-sm text-white/40">
            {dashboard.ticketsLeft}
            <br />
            tickets left
          </p>
        </div>

        <div className="mt-8 h-2 overflow-hidden bg-white/10">
          <div
            className="h-full bg-ps-red transition-all duration-500"
            style={{
              width: `${capacityPercentage}%`,
            }}
          />
        </div>
      </section>

      {/* STATISTICS */}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Tickets Left"
          value={dashboard.ticketsLeft}
          highlight
        />

        <StatCard
          label="Paid Tickets"
          value={dashboard.paidTickets}
        />

        <StatCard
          label="Free Tickets"
          value={dashboard.freeTickets}
        />

        <StatCard
          label="Pending Orders"
          value={dashboard.pendingOrders}
          highlight={dashboard.pendingOrders > 0}
        />

        <StatCard
          label="Total Tickets Purchased"
          value={dashboard.totalTickets}
        />

        <StatCard
          label="Total Amount"
          value={`₱${Number(
            dashboard.totalAmount
          ).toLocaleString()}`}
        />
      </section>
    </main>
  );
}