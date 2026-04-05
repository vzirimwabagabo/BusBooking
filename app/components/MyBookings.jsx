"use client";
import { useState, useRef } from "react";
import { isTripExpired } from "../utils/tripExpiration";
import { fetchStore, saveStore } from "../utils/dataStore";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  :root {
    --ink: #0a0a0f; --paper: #f5f3ee; --cream: #ede9e0;
    --accent: #e85d26; --accent2: #2d6be4; --muted: #9a9488;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--paper); font-family:'Poppins',sans-serif; }

  .bookings-page { min-height:100vh; background:var(--paper); }

  /* HEADER */
  .bookings-hero {
    background: var(--ink); padding: 48px 24px 60px; position:relative; overflow:hidden;
  }
  .bookings-hero::before {
    content:''; position:absolute; inset:0;
    background-image:
      radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.4) 0%,transparent 100%),
      radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.3) 0%,transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.3) 0%,transparent 100%);
    background-size:300px 300px,250px 250px,400px 400px;
  }
  .bookings-hero-inner { max-width:640px; margin:0 auto; position:relative; z-index:1; }
  .back-btn {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
    color:#f5f3ee; padding:8px 16px; border-radius:10px; cursor:pointer;
    font-family:'Poppins',sans-serif; font-size:0.78rem; font-weight:600;
    margin-bottom:24px; transition:all 0.2s;
  }
  .back-btn:hover { background:rgba(255,255,255,0.15); }
  .bookings-hero .label {
    font-size:0.65rem; letter-spacing:0.3em; color:var(--accent);
    text-transform:uppercase; margin-bottom:10px; display:block;
  }
  .bookings-hero h1 {
    font-family:'Poppins',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem);
    font-weight:800; color:#f5f3ee; line-height:1.1; letter-spacing:-0.02em; margin-bottom:8px;
  }
  .bookings-hero p { color:var(--muted); font-size:0.85rem; }

  /* LOOKUP FORM */
  .lookup-form {
    background:white; border-radius:16px; padding:8px;
    display:flex; gap:8px; margin-top:28px;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
  }
  .lookup-input {
    flex:1; padding:12px 16px; border:none; border-radius:10px;
    font-family:'Poppins',sans-serif; font-size:0.85rem; color:var(--ink);
    background:var(--cream); outline:none; letter-spacing:0.05em;
  }
  .lookup-input::placeholder { color:var(--muted); }
  .lookup-btn {
    padding:12px 24px; background:var(--accent); color:white; border:none;
    border-radius:10px; font-family:'Poppins',sans-serif; font-weight:700;
    font-size:0.78rem; letter-spacing:0.05em; text-transform:uppercase;
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .lookup-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(232,93,38,0.3); }

  /* CONTENT */
  .bookings-content { max-width:640px; margin:0 auto; padding:48px 24px; }

  /* EMPTY STATE */
  .empty-state {
    text-align:center; padding:60px 24px; color:var(--muted);
  }
  .empty-state .icon { font-size:3rem; margin-bottom:16px; }
  .empty-state h3 { font-family:'Poppins',sans-serif; font-size:1.1rem; color:var(--ink); margin-bottom:8px; font-weight:700; }
  .empty-state p { font-size:0.85rem; line-height:1.6; }

  /* NOT FOUND */
  .not-found {
    background:#fff3f0; border:1.5px solid rgba(232,93,38,0.2);
    border-radius:16px; padding:24px; text-align:center; margin-top:8px;
  }
  .not-found .icon { font-size:2rem; margin-bottom:12px; }
  .not-found h3 { font-family:'Poppins',sans-serif; font-size:1rem; color:var(--ink); margin-bottom:6px; font-weight:700; }
  .not-found p { font-size:0.82rem; color:var(--muted); }

  /* BOOKING CARD */
  .booking-card {
    background:white; border-radius:20px; padding:28px;
    border:1.5px solid rgba(0,0,0,0.06);
    box-shadow:0 4px 20px rgba(0,0,0,0.06);
    animation: cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cardIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

  .card-top {
    display:flex; justify-content:space-between; align-items:flex-start;
    margin-bottom:20px; flex-wrap:wrap; gap:12px;
  }
  .booking-ref-badge {
    font-family:'Poppins',sans-serif; font-size:0.75rem; font-weight:700;
    letter-spacing:0.15em; color:var(--accent);
    background:#fff3f0; padding:6px 12px; border-radius:8px;
    border:1px solid rgba(232,93,38,0.2);
  }
  .status-badge {
    font-size:0.72rem; font-weight:700; padding:6px 12px; border-radius:8px;
    font-family:'Poppins',sans-serif; letter-spacing:0.05em;
  }
  .status-badge.confirmed { background:#e8f5e9; color:#2e7d32; }
  .status-badge.cancelled { background:#fce4ec; color:#c62828; }
  .status-badge.expired { background:#fff3e0; color:#e65100; }

  .card-route {
    display:flex; align-items:center; gap:12px; margin-bottom:20px;
  }
  .card-city {
    font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink);
  }
  .card-arrow {
    flex:1; max-width:60px; height:1px;
    background:linear-gradient(to right,var(--ink),var(--accent));
    position:relative;
  }
  .card-arrow::after {
    content:'→'; position:absolute; right:-8px; top:50%; transform:translateY(-50%);
    color:var(--accent); font-size:0.85rem;
  }

  .card-meta {
    display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;
  }
  .card-meta-item .meta-label {
    font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:3px;
  }
  .card-meta-item .meta-val {
    font-family:'Poppins',sans-serif; font-size:0.88rem; font-weight:600; color:var(--ink);
  }

  .seats-list {
    display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px;
  }
  .seat-chip {
    background:var(--cream); border-radius:8px; padding:5px 10px;
    font-family:'Poppins',sans-serif; font-size:0.78rem; font-weight:700; color:var(--ink);
  }
  .seat-chip.cancelled-seat {
    background:#fce4ec; color:#c62828; text-decoration:line-through;
  }

  .card-divider { height:1px; background:rgba(0,0,0,0.06); margin:20px 0; }

  .passengers-section { margin-bottom:20px; }
  .passengers-header {
    font-family:'Poppins',sans-serif; font-size:0.82rem; font-weight:700;
    letter-spacing:0.05em; text-transform:uppercase; color:var(--ink);
    margin-bottom:12px; display:block;
  }
  .passenger-detail-item {
    background:var(--cream); border-radius:10px; padding:12px; margin-bottom:10px;
    border:1px solid rgba(0,0,0,0.05);
  }
  .passenger-detail-item .seat {
    font-family:'Poppins',sans-serif; font-weight:700; font-size:0.78rem;
    color:var(--accent); margin-bottom:6px;
  }
  .passenger-detail-item .name {
    font-family:'Poppins',sans-serif; font-weight:600; font-size:0.85rem;
    color:var(--ink); margin-bottom:3px;
  }
  .passenger-detail-item .contact {
    font-size:0.75rem; color:var(--muted); line-height:1.5;
  }
  .passenger-detail-item .contact span {
    display:block; word-break:break-all;
  }

  .card-total {
    display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;
  }
  .card-total .lbl { font-size:0.82rem; color:var(--muted); }
  .card-total .val { font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink); }

  .card-actions { display:flex; gap:10px; flex-wrap:wrap; }
  .action-btn {
    flex:1; padding:12px; border:none; border-radius:12px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:0.78rem;
    letter-spacing:0.05em; text-transform:uppercase; cursor:pointer;
    transition:all 0.2s; min-width:120px;
  }
  .action-btn.modify {
    background:var(--ink); color:var(--paper);
  }
  .action-btn.modify:hover { background:#1e1e2e; transform:translateY(-1px); }
  .action-btn.cancel {
    background:white; color:#c62828;
    border:1.5px solid rgba(198,40,40,0.2);
  }
  .action-btn.cancel:hover { background:#fce4ec; transform:translateY(-1px); }

  /* CANCEL CONFIRM */
  .cancel-confirm {
    background:#fff3f0; border:1.5px solid rgba(232,93,38,0.2);
    border-radius:16px; padding:24px; margin-top:16px;
    animation: cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cancel-confirm h4 { font-family:'Poppins',sans-serif; font-weight:700; font-size:0.95rem; margin-bottom:8px; }
  .cancel-confirm p { font-size:0.82rem; color:var(--muted); margin-bottom:16px; line-height:1.6; }
  .confirm-btns { display:flex; gap:10px; }
  .confirm-btn {
    flex:1; padding:10px; border:none; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:0.78rem;
    letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; transition:all 0.2s;
  }
  .confirm-btn.yes { background:#c62828; color:white; }
  .confirm-btn.yes:hover { background:#b71c1c; }
  .confirm-btn.no { background:var(--cream); color:var(--ink); }
  .confirm-btn.no:hover { background:#ddd; }

  /* DELETE BUTTON */
  .action-btn.delete {
    background:#f5e0dd; color:#c62828; border:1px solid rgba(198,40,40,0.2);
  }
  .action-btn.delete:hover { background:#ffe0e0; transform:translateY(-1px); }

  /* DELETE CONFIRM */
  .delete-confirm {
    background:#fff3f0; border:1.5px solid rgba(198,40,40,0.3);
    border-radius:16px; padding:24px; margin-top:16px;
    animation: cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .delete-confirm h4 { font-family:'Poppins',sans-serif; font-weight:700; font-size:0.95rem; margin-bottom:8px; color:#c62828; }
  .delete-confirm p { font-size:0.82rem; color:var(--muted); margin-bottom:16px; line-height:1.6; }
`;

const PRICE_PER_SEAT = 1200;

export default function MyBookings({ onBack, onModify }) {
  const [refInput, setRefInput] = useState("");
  const [seatsInput, setSeatsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]); // For multiple bookings from name search
  const [notFound, setNotFound] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searched, setSearched] = useState(false);
  const bookingPrice = booking?.price ?? PRICE_PER_SEAT;
  const bookingCardRef = useRef(null);

  const handleLookup = async () => {
    const ref = refInput.trim().toUpperCase();
    const seats = seatsInput.trim().toUpperCase().split(',').map(s => s.trim()).filter(s => s);
    const date = dateInput.trim();
    const name = nameInput.trim().toLowerCase();

    if (!ref && seats.length === 0 && !name) return;

    const store = await fetchStore();
    const allBookings = store.bookings || [];
    let foundBookings = [];

    if (ref) {
      const found = allBookings.find((b) => b.ref === ref);
      foundBookings = found ? [found] : [];
    } else if (seats.length > 0) {
      const found = allBookings.find((b) =>
        seats.every(seat => b.seats.includes(seat)) &&
        b.status === "confirmed" &&
        (!date || b.date === date)
      );
      foundBookings = found ? [found] : [];
    } else if (name) {
      // Search by passenger name
      foundBookings = allBookings.filter((b) => {
        if (!b.passengers) return false;
        return Object.values(b.passengers).some((passenger) => {
          const passengerName = (passenger.name || "").toLowerCase();
          return passengerName.includes(name);
        });
      });
    }

    setBooking(foundBookings.length === 1 ? foundBookings[0] : null);
    setBookings(foundBookings);
    setNotFound(foundBookings.length === 0);
    setSearched(true);
  };

  const handleCancel = async () => {
    const store = await fetchStore();
    const updated = store.bookings.map((b) =>
      b.ref === booking.ref ? { ...b, status: "cancelled" } : b
    );
    store.bookings = updated;

    // Release the seats back to available so they can be booked again
    if (booking.tripId) {
      const taken = store.takenSeats[booking.tripId] || [];
      store.takenSeats[booking.tripId] = taken.filter(s => !booking.seats.includes(s));
    }

    await saveStore(store);

    setBooking({ ...booking, status: "cancelled" });
    setShowCancelConfirm(false);
  };

  const handleDelete = async () => {
    const store = await fetchStore();
    store.bookings = store.bookings.filter((b) => b.ref !== booking.ref);
    await saveStore(store);

    // Reset to search view
    setBooking(null);
    setBookings(bookings.filter((b) => b.ref !== booking.ref));
    setShowDeleteConfirm(false);

    // If no more bookings in search results, show not found
    if (bookings.length === 1) {
      setNotFound(true);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bookings-page">

        {/* HERO */}
        <div className="bookings-hero">
          <div className="bookings-hero-inner">
            <button className="back-btn" onClick={onBack}>← Back to trips</button>
            <span className="label">Manage your trip</span>
            <h1>My Bookings</h1>
            <p>Search by booking reference, passenger name, seat numbers, or trip date to view, modify or cancel your reservation.</p>

            <div className="lookup-form" style={{ flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  className="lookup-input"
                  placeholder="Enter reference e.g. RF-ABC123"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                <button className="lookup-btn" onClick={handleLookup}>Find →</button>
              </div>
              <div style={{ margin: "8px 0", textAlign: "center", color: "var(--muted)", fontSize: "0.8rem" }}>OR</div>
              <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                <input
                  className="lookup-input"
                  placeholder="Enter passenger name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
              </div>
              <div style={{ margin: "8px 0", textAlign: "center", color: "var(--muted)", fontSize: "0.8rem" }}>OR</div>
              <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                <input
                  className="lookup-input"
                  placeholder="Enter seat numbers e.g. 1A,1B"
                  value={seatsInput}
                  onChange={(e) => setSeatsInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                <input
                  className="lookup-input"
                  type="date"
                  placeholder="(Optional) Trip date to narrow search"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="bookings-content">

          {/* default empty */}
          {!searched && (
            <div className="empty-state">
              <div className="icon">🎫</div>
              <h3>Find your booking</h3>
              <p>Type in the reference code you received<br />when you booked your seats.</p>
            </div>
          )}

          {/* not found */}
          {notFound && (
            <div className="not-found">
              <div className="icon">🔍</div>
              <h3>No booking found</h3>
              <p>We couldn&apos;t find a booking with that reference.<br />Double check and try again.</p>
            </div>
          )}

          {/* Multiple bookings from name search */}
          {bookings.length > 1 && (
            <div>
              <div style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", color: "var(--ink)", fontFamily: "'Poppins', sans-serif" }}>
                Found {bookings.length} bookings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {bookings.map((b) => (
                  <div
                    key={b.ref}
                    className="booking-card"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => {
                      setBooking(b);
                      // Scroll to booking card after state update
                      setTimeout(() => {
                        if (bookingCardRef.current) {
                          bookingCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }, 0);
                    }}
                  >
                    <div className="card-top">
                      <div className="booking-ref-badge">{b.ref}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {isTripExpired(b.date) && (
                          <div className="status-badge expired">
                            ⏱ Trip Completed
                          </div>
                        )}
                        <div className={`status-badge ${b.status}`}>
                          {b.status === "confirmed" ? "✓ Confirmed" : "✕ Cancelled"}
                        </div>
                      </div>
                    </div>
                    <div className="card-route">
                      <span className="card-city">{b.from}</span>
                      <div className="card-arrow" />
                      <span className="card-city">{b.to}</span>
                    </div>
                    <div className="card-meta">
                      <div className="card-meta-item">
                        <div className="meta-label">Date</div>
                        <div className="meta-val">{b.date}</div>
                      </div>
                      <div className="card-meta-item">
                        <div className="meta-label">Seats</div>
                        <div className="meta-val">{b.seats.length}</div>
                      </div>
                      <div className="card-meta-item">
                        <div className="meta-label">Total</div>
                        <div className="meta-val">KES {(b.seats.length * (b.price || PRICE_PER_SEAT)).toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--muted)", marginTop: "12px" }}>
                      Click to view details →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* booking card */}
          {booking && (
            <>
              {bookings.length > 1 && (
                <button
                  onClick={() => {
                    setBooking(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(232,93,38,0.1)",
                    border: "1px solid rgba(232,93,38,0.3)",
                    color: "var(--accent)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    marginBottom: "16px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(232,93,38,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(232,93,38,0.1)";
                  }}
                >
                  ← Back to Bookings List
                </button>
              )}
              <div className="booking-card" ref={bookingCardRef}>
                <div className="card-top">
                  <div className="booking-ref-badge">{booking.ref}</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {isTripExpired(booking.date) && (
                      <div className="status-badge expired">
                        Trip Completed
                      </div>
                    )}
                    <div className={`status-badge ${booking.status}`}>
                      {booking.status === "confirmed" ? "✓ Confirmed" : "✕ Cancelled"}
                    </div>
                  </div>
                </div>

                <div className="card-route">
                  <span className="card-city">{booking.from}</span>
                  <div className="card-arrow" />
                  <span className="card-city">{booking.to}</span>
                </div>

                <div className="card-meta">
                  <div className="card-meta-item">
                    <div className="meta-label">Date</div>
                    <div className="meta-val">{booking.date}</div>
                  </div>
                  <div className="card-meta-item">
                    <div className="meta-label">Departure</div>
                    <div className="meta-val">{booking.time}</div>
                  </div>
                  <div className="card-meta-item">
                    <div className="meta-label">Passengers</div>
                    <div className="meta-val">{booking.seats.length}</div>
                  </div>
                </div>

                <div className="meta-label" style={{ marginBottom: 8 }}>Seats</div>
                <div className="seats-list">
                  {booking.seats.map((s) => (
                    <div key={s} className={`seat-chip ${booking.status === "cancelled" ? "cancelled-seat" : ""}`}>
                      Seat {s}
                    </div>
                  ))}
                </div>

                {booking.passengers && Object.keys(booking.passengers).length > 0 && (
                  <div className="passengers-section">
                    <span className="passengers-header">Passengers</span>
                    {booking.seats.map((seat) => {
                      const passenger = booking.passengers[seat];
                      if (!passenger) return null;
                      return (
                        <div key={seat} className="passenger-detail-item">
                          <div className="seat">Seat {seat}</div>
                          <div className="name">{passenger.name || "—"}</div>
                          <div className="contact">
                            {passenger.email && <span> {passenger.email}</span>}
                            {passenger.phone && <span> {passenger.phone}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="card-divider" />

                <div className="card-total">
                  <span className="lbl">Total paid</span>
                  <span className="val">KES {(booking.seats.length * bookingPrice).toLocaleString()}</span>
                </div>
                {booking.status === "confirmed" && !isTripExpired(booking.date) && (
                  <div className="card-actions">
                    <button className="action-btn modify" onClick={() => onModify(booking)}>
                      ✎ Modify Seats
                    </button>
                    <button className="action-btn cancel" onClick={() => setShowCancelConfirm(true)}>
                      ✕ Cancel Booking
                    </button>
                  </div>
                )}

                {(booking.status === "cancelled" || isTripExpired(booking.date)) && (
                  <div className="card-actions">
                    <button className="action-btn delete" onClick={() => setShowDeleteConfirm(true)}>
                      🗑 Remove from History
                    </button>
                  </div>
                )}

                {showCancelConfirm && (
                  <div className="cancel-confirm">
                    <h4>Cancel this booking?</h4>
                    <p>Your seats will be released and made available to others. This cannot be undone.</p>
                    <div className="confirm-btns">
                      <button className="confirm-btn yes" onClick={handleCancel}>Yes, cancel it</button>
                      <button className="confirm-btn no" onClick={() => setShowCancelConfirm(false)}>Keep it</button>
                    </div>
                  </div>
                )}

                {showDeleteConfirm && (
                  <div className="delete-confirm">
                    <h4>Remove this booking from history?</h4>
                    <p>This booking will be permanently deleted from your history. {booking.status === "confirmed" && "You should keep this for your records."} This cannot be undone.</p>
                    <div className="confirm-btns">
                      <button className="confirm-btn yes" onClick={handleDelete}>Yes, delete it</button>
                      <button className="confirm-btn no" onClick={() => setShowDeleteConfirm(false)}>Keep it</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
