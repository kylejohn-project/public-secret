import { useState } from "react";
import { getAdminToken } from "../../services/adminAuth";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export default function AdminCheckIn() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function search(event) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const url = `${API_URL}?action=searchTicketsForCheckIn&query=${encodeURIComponent(query.trim())}&token=${encodeURIComponent(getAdminToken())}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Search failed.");
      const grouped = Object.values((data.tickets || []).reduce((acc, ticket) => {
        const key = `${ticket.orderId}::${ticket.customerName}`;
        if (!acc[key]) acc[key] = { key, name: ticket.customerName, orderId: ticket.orderId, tickets: [] };
        acc[key].tickets.push(ticket);
        return acc;
      }, {}));
      setResults(grouped);
      if (!grouped.length) setError("No matching tickets found.");
    } catch (err) {
      setError(err.message || "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function addGroup(group) {
    setGroups(prev => prev.some(g => g.key === group.key) ? prev : [...prev, group]);
    setResults([]);
    setQuery("");
    setError("");
  }

  function removeGroup(key) {
    const group = groups.find(g => g.key === key);
    setGroups(prev => prev.filter(g => g.key !== key));
    if (group) setSelected(prev => prev.filter(id => !group.tickets.some(t => t.ticketId === id)));
  }

  function toggleTicket(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function selectGroup(group) {
    const available = group.tickets.filter(t => t.status === "GENERATED").map(t => t.ticketId);
    setSelected(prev => [...new Set([...prev, ...available])]);
  }

  async function checkInSelected() {
    if (!selected.length || loading) return;
    if (!window.confirm(`Check in ${selected.length} selected ticket(s)?`)) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "checkInTicketsBulk", ticketIds: selected, token: getAdminToken() }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Check-in failed.");
      const succeeded = new Set((data.results || []).filter(r => r.success).map(r => r.ticketId));
      setGroups(prev => prev.map(group => ({
        ...group,
        tickets: group.tickets.map(ticket => succeeded.has(ticket.ticketId) ? { ...ticket, status: "CHECKED_IN" } : ticket),
      })));
      setSelected([]);
      setSuccess(`${data.checkedInCount} ticket(s) checked in successfully.${data.failedCount ? ` ${data.failedCount} failed; search again to refresh their status.` : ""}`);
      if (data.failedCount) setError((data.results || []).filter(r => !r.success).map(r => `${r.ticketId}: ${r.message}`).join(" | "));
    } catch (err) {
      setError(err.message || "Check-in failed. Please search again to verify status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">Public Secret 001</p>
      <h1 className="mt-5 text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">Check In</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/40">Search by purchaser name or ticket ID. Add multiple orders, then check in selected tickets together.</p>

      <form onSubmit={search} className="mt-12 border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Ticket Holder Name or Ticket ID</label>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Search name or ticket ID..." className="input h-14 flex-1 rounded-none border-white/10 bg-white/[0.03] text-sm text-white focus:border-ps-red" />
          <button type="submit" disabled={loading || query.trim().length < 2} className="btn h-14 rounded-none border-0 bg-white px-8 text-xs text-black hover:bg-neutral-200">{loading ? "SEARCHING..." : "SEARCH"}</button>
        </div>
      </form>

      {results.length > 0 && (
        <section className="mt-6 border border-white/10 p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Search Results — Select an Order</h2>
          <div className="mt-4 space-y-3">
            {results.map(group => (
              <div key={group.key} className="flex flex-col gap-3 border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-bold uppercase">{group.name}</p><p className="mt-1 break-all text-xs text-white/40">{group.orderId} · {group.tickets.length} ticket(s)</p></div>
                <button type="button" onClick={() => addGroup(group)} disabled={groups.some(g => g.key === group.key)} className="btn rounded-none border-0 bg-ps-red text-xs text-white hover:bg-ps-red-hover disabled:opacity-40">{groups.some(g => g.key === group.key) ? "ADDED" : "ADD TICKETS"}</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {error && <div className="mt-6 border border-red-500/30 bg-red-500/5 p-5 text-sm text-red-300">{error}</div>}
      {success && <div className="mt-6 border border-green-500/30 bg-green-500/5 p-5 text-sm text-green-300">{success}</div>}

      {groups.length > 0 && (
        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black uppercase">Selected Ticket Holders ({groups.length})</h2><button type="button" onClick={() => setSelected([])} className="text-xs font-bold text-white/50 hover:text-white">CLEAR SELECTION</button></div>
          {groups.map(group => (
            <div key={group.key} className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="text-xl font-black uppercase">{group.name}</h3><p className="mt-1 break-all text-xs text-white/40">{group.orderId}</p></div>
                <button type="button" onClick={() => removeGroup(group.key)} className="text-xs font-bold text-red-400 hover:text-red-300">REMOVE</button>
              </div>
              <button type="button" onClick={() => selectGroup(group)} className="mt-5 text-xs font-bold uppercase text-ps-red hover:underline">Select all available</button>
              <div className="mt-3 space-y-2">
                {group.tickets.map((ticket, index) => (
                  <label key={ticket.ticketId} className={`flex items-center gap-3 border border-white/10 p-3 ${ticket.status !== "GENERATED" ? "opacity-50" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={selected.includes(ticket.ticketId)} disabled={ticket.status !== "GENERATED" || loading} onChange={() => toggleTicket(ticket.ticketId)} className="checkbox checkbox-sm rounded-none border-white/30 [--chkbg:#dc2626] [--chkfg:white]" />
                    <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Ticket {index + 1}</span><span className="block break-all font-mono text-xs text-white/40">{ticket.ticketId}</span></span>
                    <span className={`text-[10px] font-bold uppercase ${ticket.status === "CHECKED_IN" ? "text-green-400" : "text-white/50"}`}>{ticket.status === "GENERATED" ? "Available" : ticket.status.replaceAll("_", " ")}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="sticky bottom-0 border border-white/10 bg-[#050505] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs uppercase text-white/50">Tickets selected</span><span className="text-2xl font-black">{selected.length}</span></div>
            <button type="button" onClick={checkInSelected} disabled={loading || !selected.length} className="btn h-16 w-full rounded-none border-0 bg-ps-red text-sm font-black text-white hover:bg-ps-red-hover disabled:opacity-40">{loading ? "PROCESSING..." : `CHECK IN ${selected.length} TICKET${selected.length === 1 ? "" : "S"}`}</button>
          </div>
        </section>
      )}
    </main>
  );
}
