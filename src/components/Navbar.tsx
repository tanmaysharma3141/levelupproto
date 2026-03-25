import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const location = useLocation();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        transparent
          ? "bg-transparent"
          : "bg-cream/95 backdrop-blur-sm border-b border-charcoal/10"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-wide text-foreground">
            THE ATELIER
          </span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Grooming Studio
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              "font-body text-sm tracking-wide transition-colors",
              location.pathname === "/"
                ? "text-gold font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Home
          </Link>
          <Link
            to="/booking"
            className={cn(
              "font-body text-sm tracking-wide transition-colors",
              location.pathname === "/booking"
                ? "text-gold font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Book
          </Link>
          <Link
            to="/admin"
            className={cn(
              "font-body text-sm tracking-wide transition-colors",
              location.pathname === "/admin"
                ? "text-gold font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Admin
          </Link>
        </div>

        {/* CTA */}
        <Link
          to="/booking"
          className="hidden md:inline-flex items-center justify-center px-5 py-2 bg-gold text-primary-foreground font-body text-sm tracking-wide hover:bg-primary-hover transition-colors duration-200"
        >
          Book Now
        </Link>

        {/* Mobile menu icon placeholder */}
        <Link
          to="/booking"
          className="md:hidden inline-flex items-center justify-center px-4 py-1.5 bg-gold text-primary-foreground font-body text-xs tracking-wide"
        >
          Book
        </Link>
      </nav>
    </header>
  );
}
