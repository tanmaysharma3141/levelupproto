export type BookingStatus = "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  stylist: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // "HH:MM"
  status: BookingStatus;
  createdAt: string;
}

const STORAGE_KEY = "salon_bookings";

export const services = [
  { id: "haircut", label: "Classic Haircut", price: "$45", duration: "45 min" },
  { id: "haircut_beard", label: "Haircut & Beard", price: "$65", duration: "60 min" },
  { id: "beard_trim", label: "Beard Trim & Shape", price: "$30", duration: "30 min" },
  { id: "shave", label: "Hot Towel Shave", price: "$50", duration: "45 min" },
  { id: "fade", label: "Skin Fade", price: "$40", duration: "45 min" },
  { id: "color", label: "Hair Color", price: "$85", duration: "90 min" },
];

export const stylists = [
  { id: "alex", name: "Alex M.", specialty: "Classic Cuts & Fades", avatar: "AM" },
  { id: "james", name: "James O.", specialty: "Beard Styling", avatar: "JO" },
  { id: "sara", name: "Sara K.", specialty: "Color & Highlights", avatar: "SK" },
  { id: "noah", name: "Noah R.", specialty: "Modern Styles", avatar: "NR" },
];

export const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getBookings(): Booking[] {
  return loadBookings();
}

export interface BookingInput {
  name: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
}

export type BookingResult =
  | { success: true; booking: Booking }
  | { success: false; error: string };

export function createBooking(input: BookingInput): BookingResult {
  const bookings = loadBookings();

  // Double-booking prevention: same stylist, same date, same time
  const conflict = bookings.find(
    (b) =>
      b.stylist === input.stylist &&
      b.date === input.date &&
      b.time === input.time &&
      b.status !== "cancelled"
  );

  if (conflict) {
    return {
      success: false,
      error: `${input.stylist} is already booked at ${input.time} on that day. Please choose a different time or stylist.`,
    };
  }

  const booking: Booking = {
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...input,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  saveBookings(bookings);
  return { success: true, booking };
}

export function updateBookingStatus(id: string, status: BookingStatus): boolean {
  const bookings = loadBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = status;
  saveBookings(bookings);
  return true;
}

export function cancelBooking(id: string): boolean {
  return updateBookingStatus(id, "cancelled");
}

const SEED_KEY = "salon_seeded";

export function seedDemoData(): void {
  if (localStorage.getItem(SEED_KEY)) return;
  const demos: Omit<Booking, "id" | "createdAt">[] = [
    { name: "James Whitfield", phone: "+44 7700 100001", service: "haircut", stylist: "alex", date: getTodayStr(1), time: "09:00", status: "confirmed" },
    { name: "Liam Bennett", phone: "+44 7700 100002", service: "beard_trim", stylist: "james", date: getTodayStr(1), time: "10:00", status: "confirmed" },
    { name: "Oliver Hayes", phone: "+44 7700 100003", service: "shave", stylist: "alex", date: getTodayStr(2), time: "11:30", status: "confirmed" },
    { name: "Marcus Drake", phone: "+44 7700 100004", service: "haircut_beard", stylist: "noah", date: getTodayStr(-1), time: "14:00", status: "completed" },
    { name: "Daniel Stone", phone: "+44 7700 100005", service: "fade", stylist: "alex", date: getTodayStr(-2), time: "10:30", status: "completed" },
    { name: "Ryan Cole", phone: "+44 7700 100006", service: "color", stylist: "sara", date: getTodayStr(3), time: "13:00", status: "confirmed" },
    { name: "Noah Park", phone: "+44 7700 100007", service: "haircut", stylist: "james", date: getTodayStr(-3), time: "15:00", status: "cancelled" },
  ];
  const bookings: Booking[] = demos.map((d, i) => ({
    ...d,
    id: `demo_${i}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  localStorage.setItem(SEED_KEY, "1");
}

function getTodayStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}


export function completeBooking(id: string): boolean {
  return updateBookingStatus(id, "completed");
}
