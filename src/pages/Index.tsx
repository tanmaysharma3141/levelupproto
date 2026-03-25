import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";
import { services, stylists } from "@/lib/bookingStore";

const stats = [
  { value: "12+", label: "Years of craft" },
  { value: "4,800+", label: "Clients served" },
  { value: "4", label: "Master stylists" },
];

const testimonials = [
  {
    quote: "The most precise haircut I've ever had. The atelier is in a class of its own.",
    author: "Marcus T.",
    detail: "Regular client since 2019",
  },
  {
    quote: "Every visit feels like a ritual. The hot towel shave is absolutely unmatched.",
    author: "Daniel K.",
    detail: "Client since 2021",
  },
  {
    quote: "The team here understands grooming as an art form. Truly exceptional service.",
    author: "Ryan P.",
    detail: "Client since 2022",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="The Atelier Grooming Studio"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">
              Est. 2012 · London
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-light text-cream leading-[0.95] mb-6 text-balance">
              The Art of
              <br />
              <em className="italic">Perfect</em> Grooming
            </h1>
            <p className="font-body text-base md:text-lg text-cream/80 mb-10 max-w-md leading-relaxed">
              A sanctuary of craft and precision. Each appointment is an experience
              tailored entirely to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary-hover transition-colors duration-200"
              >
                Book Your Visit
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-cream/40 text-cream font-body text-sm tracking-widest uppercase hover:bg-cream/10 transition-colors duration-200"
              >
                Our Services
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-cream/20 pt-8 max-w-md">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-cream font-light">{s.value}</p>
                <p className="font-body text-xs text-cream/60 mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
                Services
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light text-foreground">
                Our Offerings
              </h2>
            </div>
            <Link
              to="/booking"
              className="hidden md:inline-flex items-center gap-2 font-body text-sm text-gold hover:underline underline-offset-4 transition-colors"
            >
              Book Now →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-charcoal/10">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-background p-8 group hover:bg-surface-alt transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl font-light text-foreground">
                    {svc.label}
                  </h3>
                  <span className="font-display text-2xl text-gold font-light">
                    {svc.price}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground">{svc.duration}</p>
                <div className="mt-6 h-px bg-charcoal/10 group-hover:bg-gold/30 transition-colors duration-300" />
                <Link
                  to="/booking"
                  className="mt-4 inline-flex font-body text-xs tracking-widest uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Book this service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stylists */}
      <section className="py-24 bg-surface-alt">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Team
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground">
              Master Stylists
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stylists.map((stylist) => (
              <div key={stylist.id} className="group">
                {/* Avatar placeholder */}
                <div className="w-full aspect-square bg-charcoal/6 flex items-center justify-center mb-5 overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center">
                    <span className="font-display text-2xl text-gold font-light">
                      {stylist.avatar}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {stylist.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {stylist.specialty}
                </p>
                <Link
                  to="/booking"
                  className="mt-3 inline-flex font-body text-xs tracking-widest uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Book with {stylist.name.split(" ")[0]} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-foreground">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-charcoal/10 p-8">
                <p className="font-display text-xl italic text-foreground leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="border-t border-charcoal/10 pt-5">
                  <p className="font-body text-sm font-medium text-foreground">{t.author}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Ready?
          </p>
          <h2 className="font-display text-5xl md:text-7xl font-light text-cream mb-8 text-balance">
            Reserve Your Chair
          </h2>
          <p className="font-body text-base text-cream/60 mb-10 max-w-md mx-auto">
            Appointments available Monday through Saturday, 9 AM – 6 PM.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-10 py-4 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary-hover transition-colors duration-200"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-charcoal border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-lg text-cream font-light">THE ATELIER</p>
              <p className="font-body text-xs text-cream/40 mt-1 tracking-wide">
                12 Savile Row, London
              </p>
            </div>
            <div className="flex gap-8">
              <Link to="/" className="font-body text-xs text-cream/50 hover:text-cream/80 tracking-wide transition-colors">
                Home
              </Link>
              <Link to="/booking" className="font-body text-xs text-cream/50 hover:text-cream/80 tracking-wide transition-colors">
                Book
              </Link>
              <Link to="/admin" className="font-body text-xs text-cream/50 hover:text-cream/80 tracking-wide transition-colors">
                Admin
              </Link>
            </div>
            <p className="font-body text-xs text-cream/30">
              © 2024 The Atelier Grooming Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
