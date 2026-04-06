"use client";
import { useState, useEffect } from "react";
import TripsPage from "./components/TripsPage";
import BusBooking from "./components/BusBooking";
import MyBookings from "./components/MyBookings";
import Navbar from "./components/Navbar";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; background: #f5f3ee; color: #0a0a0f; overflow-x:hidden; }
  
  .hero-container {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 120px 24px 80px;
  }
  .starfield {
    position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 30%,#1a1830 0%,#0a0a0f 70%);
  }
  .starfield::before {
    content:''; position:absolute; inset:0;
    background-image:
      radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),
      radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.4) 0%,transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.5) 0%,transparent 100%),
      radial-gradient(1px 1px at 90% 50%,rgba(255,255,255,0.4) 0%,transparent 100%);
    background-size:300px 300px,250px 250px,400px 400px,280px 280px;
  }
  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 800px;
  }
  .hero-label {
    font-size: 0.8rem;
    letter-spacing: 0.4em;
    color: #e85d26;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: block;
    font-weight: 600;
  }
  .hero-content h1 {
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 800;
    color: #f5f3ee;
    line-height: 0.9;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
  }
  .hero-content h1 span { color: #e85d26; }
  .hero-content p {
    font-size: 1.1rem;
    color: rgba(245, 243, 238, 0.6);
    margin-bottom: 40px;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
  .cta-group {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .primary-btn {
    padding: 18px 36px;
    background: #e85d26;
    color: white;
    border-radius: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 8px 24px rgba(232, 93, 38, 0.3);
  }
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(232, 93, 38, 0.4);
    background: #f06f3d;
  }
  .secondary-btn {
    padding: 18px 36px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-radius: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }
  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .bus-visual {
    margin-top: 60px;
    width: min(600px, 90vw);
    animation: float 6s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  .content-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function BusSVG() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", filter:"drop-shadow(0 40px 80px rgba(232,93,38,0.2))" }}>
      <rect x="20" y="30" width="360" height="155" rx="18" fill="#1e1e2e" stroke="#e85d26" strokeWidth="1.5"/>
      <rect x="320" y="48" width="48" height="80" rx="8" fill="#2d3a5e" stroke="rgba(45,107,228,0.4)" strokeWidth="1"/>
      {[40,100,160,220].map((x,i) => (
        <rect key={i} x={x} y="50" width="48" height="38" rx="6" fill="#2d3a5e" stroke="rgba(45,107,228,0.3)" strokeWidth="1"/>
      ))}
      <rect x="280" y="50" width="28" height="38" rx="6" fill="#2d3a5e" stroke="rgba(45,107,228,0.3)" strokeWidth="1"/>
      <rect x="20" y="100" width="360" height="3" fill="#e85d26" opacity="0.6"/>
      <circle cx="80" cy="190" r="20" fill="#0a0a0f" stroke="#333" strokeWidth="2"/>
      <circle cx="80" cy="190" r="10" fill="#1a1a2e" stroke="#555" strokeWidth="1.5"/>
      <circle cx="310" cy="190" r="20" fill="#0a0a0f" stroke="#333" strokeWidth="2"/>
      <circle cx="310" cy="190" r="10" fill="#1a1a2e" stroke="#555" strokeWidth="1.5"/>
      <rect x="368" y="70" width="8" height="20" rx="4" fill="#e85d26" opacity="0.8"/>
      <text x="200" y="88" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="10" fill="rgba(255,255,255,0.15)" letterSpacing="8">RIDEFLOW</text>
    </svg>
  );
}

export default function Home() {
  const [view, setView] = useState("home"); // home | trips | booking | mybookings
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modifyBooking, setModifyBooking] = useState(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const handleNavigate = (newView) => {
    setView(newView);
    if (newView === "trips") {
      setModifyBooking(null);
      setSelectedTrip(null);
    }
  };

  if (view === "home") {
    return (
      <>
        <style>{styles}</style>
        <div className="hero-container">
          <div className="starfield" />
          <div className="hero-content">
            <span className="hero-label">The Future of Bus Travel</span>
            <h1>Ride<span>Flow</span></h1>
            <p>Experience seamless bus bookings with our modern, account-less platform. Choose your seat and board in minutes.</p>
            <div className="cta-group">
              <button className="primary-btn" onClick={() => setView("trips")}>Start Booking →</button>
              <button className="secondary-btn" onClick={() => setView("mybookings")}>Manage Bookings</button>
            </div>
            <div className="bus-visual">
              <BusSVG />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <Navbar currentView={view} setView={handleNavigate} />
      <main className="content-fade-in" style={{ paddingTop: "100px" }}>
        {view === "booking" && selectedTrip ? (
          <BusBooking
            trip={selectedTrip}
            modifyBooking={modifyBooking}
            onBack={() => { setView("trips"); setModifyBooking(null); }}
            onMyBookings={() => setView("mybookings")}
          />
        ) : view === "mybookings" ? (
          <MyBookings
            onBack={() => setView("trips")}
            onModify={(booking) => {
              setModifyBooking(booking);
              setSelectedTrip({ 
                id: booking.tripId, 
                from: booking.from, 
                to: booking.to, 
                date: booking.date, 
                time: booking.time, 
                price: booking.price ?? 1200 
              });
              setView("booking");
            }}
          />
        ) : (
          <TripsPage
            onSelectTrip={(trip) => { setSelectedTrip(trip); setView("booking"); }}
            onMyBookings={() => setView("mybookings")}
          />
        )}
      </main>
    </>
  );
}

