import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  getBookings,
  completeBooking,
  cancelBooking,
  seedDemoData,
  services,
  stylists,
  type Booking,
  type BookingStatus,
} from "@/lib/bookingStore";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const statusColors: Record<BookingStatus, string> = {
  confirmed: "bg-gold/10 text-gold border-gold/20",
  completed: "bg-[hsl(142_76%_97%)] text-[hsl(142_76%_25%)] border-[hsl(142_76%_73%)]",
  cancelled: "bg-charcoal/6 text-muted-foreground border-charcoal/10 line-through",
};

const statusLabels: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");

  function refresh() {
    setBookings(getBookings().reverse()); // newest first
  }

  useEffect(() => {
    seedDemoData();
    refresh();
  }, []);

  function handleComplete(id: string) {
    completeBooking(id);
    refresh();
  }

  function handleCancel(id: string) {
    cancelBooking(id);
    refresh();
  }

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.stylist.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">
              Dashboard
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Bookings
            </h1>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gold text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary-hover transition-colors self-start"
          >
            + New Booking
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", key: "all", color: "text-foreground" },
            { label: "Confirmed", key: "confirmed", color: "text-gold" },
            { label: "Completed", key: "completed", color: "text-green-700" },
            { label: "Cancelled", key: "cancelled", color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.key} className="border border-charcoal/10 bg-surface p-5">
              <p className="font-body text-xs text-muted-foreground tracking-wide">{s.label}</p>
              <p className={cn("font-display text-4xl font-light mt-1", s.color)}>
                {counts[s.key as keyof typeof counts]}
              </p>
            </div>
          ))}
        </div>

        {/* Filters & search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-1">
            {(["all", "confirmed", "completed", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 font-body text-xs tracking-wide capitalize transition-colors",
                  filter === f
                    ? "bg-charcoal text-cream"
                    : "bg-surface-alt text-muted-foreground hover:bg-charcoal/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, service…"
            className="flex-1 px-4 py-2 border border-charcoal/12 bg-surface font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-charcoal/10">
            <p className="font-display text-3xl text-muted-foreground/40 font-light">
              No bookings found
            </p>
            {bookings.length === 0 && (
              <p className="font-body text-sm text-muted-foreground mt-2">
                Bookings will appear here once clients start booking appointments.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-charcoal/10">
                    {["Name", "Phone", "Service", "Stylist", "Date", "Time", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 pr-4 font-normal"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/6">
                  {filtered.map((b) => {
                    const svcLabel = services.find((s) => s.id === b.service)?.label || b.service;
                    const styLabel = stylists.find((s) => s.id === b.stylist)?.name || b.stylist;
                    return (
                      <tr key={b.id} className="group hover:bg-surface-alt/50 transition-colors">
                        <td className="py-4 pr-4 font-body text-sm font-medium text-foreground">
                          {b.name}
                        </td>
                        <td className="py-4 pr-4 font-body text-sm text-muted-foreground tabular-nums">
                          {b.phone}
                        </td>
                        <td className="py-4 pr-4 font-body text-sm text-foreground">{svcLabel}</td>
                        <td className="py-4 pr-4 font-body text-sm text-foreground">{styLabel}</td>
                        <td className="py-4 pr-4 font-body text-sm text-muted-foreground tabular-nums">
                          {formatDate(b.date)}
                        </td>
                        <td className="py-4 pr-4 font-body text-sm text-muted-foreground tabular-nums">
                          {b.time}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 border font-body text-[10px] tracking-wide uppercase",
                              statusColors[b.status]
                            )}
                          >
                            {statusLabels[b.status]}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {b.status === "confirmed" && (
                              <>
                                <button
                                  onClick={() => handleComplete(b.id)}
                                  className="px-3 py-1.5 bg-[hsl(142_76%_97%)] border border-[hsl(142_76%_73%)] text-[hsl(142_76%_25%)] font-body text-xs hover:bg-[hsl(142_76%_93%)] transition-colors"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleCancel(b.id)}
                                  className="px-3 py-1.5 bg-destructive/8 border border-destructive/20 text-destructive font-body text-xs hover:bg-destructive/15 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((b) => {
                const svcLabel = services.find((s) => s.id === b.service)?.label || b.service;
                const styLabel = stylists.find((s) => s.id === b.stylist)?.name || b.stylist;
                return (
                  <div key={b.id} className="border border-charcoal/10 bg-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">{b.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{b.phone}</p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-1 border font-body text-[10px] tracking-wide uppercase",
                          statusColors[b.status]
                        )}
                      >
                        {statusLabels[b.status]}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="font-body text-xs text-muted-foreground">Service</span>
                        <span className="font-body text-xs text-foreground">{svcLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-xs text-muted-foreground">Stylist</span>
                        <span className="font-body text-xs text-foreground">{styLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-xs text-muted-foreground">Date & Time</span>
                        <span className="font-body text-xs text-foreground tabular-nums">
                          {formatDate(b.date)} · {b.time}
                        </span>
                      </div>
                    </div>
                    {b.status === "confirmed" && (
                      <div className="flex gap-2 border-t border-charcoal/8 pt-3">
                        <button
                          onClick={() => handleComplete(b.id)}
                          className="flex-1 py-2 bg-[hsl(142_76%_97%)] border border-[hsl(142_76%_73%)] text-[hsl(142_76%_25%)] font-body text-xs"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="flex-1 py-2 bg-destructive/8 border border-destructive/20 text-destructive font-body text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-4 font-body text-xs text-muted-foreground/60">
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      </div>
    </div>
  );
}
