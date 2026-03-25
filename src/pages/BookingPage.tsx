import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  services,
  stylists,
  timeSlots,
  createBooking,
  getBookings,
  type BookingInput,
} from "@/lib/bookingStore";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getNext30Days(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    // Skip Sundays (0)
    if (d.getDay() !== 0) {
      days.push(d.toISOString().split("T")[0]);
    }
  }
  return days;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ReturnType<typeof createBooking> | null>(null);

  const availableDays = getNext30Days();

  // Get booked slots for selected stylist + date
  const bookedSlots = getBookings()
    .filter(
      (b) =>
        b.stylist === selectedStylist &&
        b.date === selectedDate &&
        b.status !== "cancelled"
    )
    .map((b) => b.time);

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "Stylist & Date" },
    { n: 3, label: "Time" },
    { n: 4, label: "Your Details" },
  ];

  function canProceed(): boolean {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedStylist && !!selectedDate;
    if (step === 3) return !!selectedTime;
    if (step === 4) return name.trim().length > 1 && phone.trim().length >= 7;
    return false;
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const input: BookingInput = {
      name: name.trim(),
      phone: phone.trim(),
      service: selectedService,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime,
    };
    const result = createBooking(input);
    setSubmitting(false);
    if (result.success) {
      setConfirmedBooking(result);
      setConfirmed(true);
    } else {
      setError((result as { success: false; error: string }).error);
    }
  }

  if (confirmed && confirmedBooking?.success) {
    const bk = confirmedBooking.booking;
    const svc = services.find((s) => s.id === bk.service);
    const sty = stylists.find((s) => s.id === bk.stylist);
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 max-w-lg mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-14 h-14 text-gold" strokeWidth={1} />
          </div>
          <h1 className="font-display text-4xl font-light text-foreground mb-3">
            You're Confirmed
          </h1>
          <p className="font-body text-muted-foreground mb-10">
            We look forward to seeing you. A summary of your booking:
          </p>

          <div className="border border-charcoal/10 text-left divide-y divide-charcoal/8">
            {[
              { label: "Name", value: bk.name },
              { label: "Service", value: svc?.label || bk.service },
              { label: "Stylist", value: sty?.name || bk.stylist },
              { label: "Date", value: formatDate(bk.date) },
              { label: "Time", value: bk.time },
              { label: "Reference", value: bk.id },
            ].map((row) => (
              <div key={row.label} className="flex justify-between px-6 py-4">
                <span className="font-body text-sm text-muted-foreground">{row.label}</span>
                <span className="font-body text-sm font-medium text-foreground text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 border border-charcoal/20 font-body text-sm tracking-wide hover:bg-surface-alt transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setConfirmed(false);
                setStep(1);
                setSelectedService("");
                setSelectedStylist("");
                setSelectedDate("");
                setSelectedTime("");
                setName("");
                setPhone("");
              }}
              className="px-8 py-3 bg-gold text-primary-foreground font-body text-sm tracking-wide hover:bg-primary-hover transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        {/* Page heading */}
        <div className="mb-12 text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Appointment
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground">
            Book Your Visit
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <button
                className="flex flex-col items-center gap-1.5"
                onClick={() => {
                  if (s.n < step) setStep(s.n as Step);
                }}
                disabled={s.n >= step}
              >
                <div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center font-body text-xs transition-all duration-200",
                    step === s.n
                      ? "bg-gold text-primary-foreground"
                      : s.n < step
                      ? "bg-charcoal text-cream"
                      : "bg-surface-alt text-muted-foreground border border-charcoal/10"
                  )}
                >
                  {s.n < step ? "✓" : s.n}
                </div>
                <span
                  className={cn(
                    "font-body text-[10px] tracking-wide hidden sm:block",
                    step === s.n ? "text-gold font-medium" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-px mx-2 mt-[-12px] transition-colors duration-200",
                    s.n < step ? "bg-charcoal" : "bg-charcoal/15"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-light text-foreground mb-6">
              Choose a Service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className={cn(
                    "text-left p-5 border transition-all duration-200",
                    selectedService === svc.id
                      ? "border-gold bg-gold/5"
                      : "border-charcoal/10 hover:border-charcoal/30 bg-surface"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-display text-lg font-light text-foreground">
                      {svc.label}
                    </span>
                    <span className="font-display text-lg text-gold font-light ml-2">
                      {svc.price}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{svc.duration}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Stylist & Date */}
        {step === 2 && (
          <div className="animate-fade-up space-y-8">
            {/* Stylist */}
            <div>
              <h2 className="font-display text-2xl font-light text-foreground mb-5">
                Choose a Stylist
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stylists.map((sty) => (
                  <button
                    key={sty.id}
                    onClick={() => { setSelectedStylist(sty.id); setSelectedTime(""); }}
                    className={cn(
                      "flex flex-col items-center p-5 border transition-all duration-200",
                      selectedStylist === sty.id
                        ? "border-gold bg-gold/5"
                        : "border-charcoal/10 hover:border-charcoal/30 bg-surface"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center mb-3">
                      <span className="font-display text-base text-gold">{sty.avatar}</span>
                    </div>
                    <span className="font-body text-sm font-medium text-foreground">{sty.name}</span>
                    <span className="font-body text-xs text-muted-foreground text-center mt-1">{sty.specialty}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <h2 className="font-display text-2xl font-light text-foreground mb-5">
                Choose a Date
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {availableDays.map((d) => {
                  const date = new Date(d + "T00:00:00");
                  const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
                  const dayNum = date.getDate();
                  const monthName = date.toLocaleDateString("en-GB", { month: "short" });
                  return (
                    <button
                      key={d}
                      onClick={() => { setSelectedDate(d); setSelectedTime(""); }}
                      className={cn(
                        "flex flex-col items-center py-3 px-1 border transition-all duration-200 text-center",
                        selectedDate === d
                          ? "border-gold bg-gold/5"
                          : "border-charcoal/10 hover:border-charcoal/30 bg-surface"
                      )}
                    >
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wide">
                        {dayName}
                      </span>
                      <span className="font-display text-xl font-light text-foreground my-0.5">
                        {dayNum}
                      </span>
                      <span className="font-body text-[10px] text-muted-foreground">
                        {monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-light text-foreground mb-2">
              Choose a Time
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {formatDate(selectedDate)} · {stylists.find((s) => s.id === selectedStylist)?.name}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((t) => {
                const isBooked = bookedSlots.includes(t);
                return (
                  <button
                    key={t}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      "py-3 border font-body text-sm transition-all duration-200",
                      isBooked
                        ? "border-charcoal/6 bg-surface-alt text-muted-foreground/40 cursor-not-allowed line-through"
                        : selectedTime === t
                        ? "border-gold bg-gold/5 text-gold font-medium"
                        : "border-charcoal/10 hover:border-charcoal/30 bg-surface text-foreground"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {bookedSlots.length > 0 && (
              <p className="mt-4 font-body text-xs text-muted-foreground">
                Crossed-out times are already booked.
              </p>
            )}
          </div>
        )}

        {/* Step 4: Contact details */}
        {step === 4 && (
          <div className="animate-fade-up max-w-md">
            <h2 className="font-display text-2xl font-light text-foreground mb-6">
              Your Details
            </h2>

            {/* Summary */}
            <div className="border border-charcoal/10 p-5 mb-8 bg-surface-alt">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Booking Summary</p>
              <div className="space-y-2">
                {[
                  { label: "Service", value: services.find((s) => s.id === selectedService)?.label },
                  { label: "Stylist", value: stylists.find((s) => s.id === selectedStylist)?.name },
                  { label: "Date", value: formatDate(selectedDate) },
                  { label: "Time", value: selectedTime },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="font-body text-xs text-muted-foreground">{row.label}</span>
                    <span className="font-body text-xs font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-charcoal/12 bg-surface font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-xs tracking-wide uppercase text-muted-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 000000"
                  className="w-full px-4 py-3 border border-charcoal/12 bg-surface font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 p-4 bg-destructive/8 border border-destructive/20 text-destructive font-body text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-charcoal/8 pt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className={cn(
                "px-8 py-3 font-body text-sm tracking-wide transition-colors duration-200",
                canProceed()
                  ? "bg-gold text-primary-foreground hover:bg-primary-hover"
                  : "bg-charcoal/10 text-muted-foreground cursor-not-allowed"
              )}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className={cn(
                "px-8 py-3 font-body text-sm tracking-wide transition-colors duration-200",
                canProceed() && !submitting
                  ? "bg-gold text-primary-foreground hover:bg-primary-hover"
                  : "bg-charcoal/10 text-muted-foreground cursor-not-allowed"
              )}
            >
              {submitting ? "Confirming…" : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
