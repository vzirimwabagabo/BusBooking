import { useState, useEffect } from "react";

const styles = `
  .navbar {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: min(900px, 92vw);
    height: 72px;
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
  }
  .navbar.scrolled {
    top: 12px;
    width: min(940px, 96vw);
    background: rgba(10, 10, 15, 0.95);
  }
  .nav-logo {
    font-family: 'Poppins', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #f5f3ee;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-logo span { color: #e85d26; }
  
  .nav-links {
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px;
    border-radius: 14px;
  }
  .nav-link {
    padding: 10px 18px;
    border-radius: 11px;
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: transparent;
    font-family: 'Poppins', sans-serif;
  }
  .nav-link:hover {
    color: #f5f3ee;
    background: rgba(255, 255, 255, 0.05);
  }
  .nav-link.active {
    color: #f5f3ee;
    background: #e85d26;
    box-shadow: 0 4px 12px rgba(232, 93, 38, 0.3);
  }

  @media (max-width: 600px) {
    .navbar { padding: 0 16px; height: 64px; top: 16px; }
    .nav-logo { font-size: 1.2rem; }
    .nav-link { padding: 8px 12px; font-size: 0.75rem; }
  }
`;

export default function Navbar({ currentView, setView }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => setView("trips")}>
          Ride<span>Flow</span>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${currentView === "trips" ? "active" : ""}`}
            onClick={() => setView("trips")}
          >
            Find Trips
          </button>
          <button 
            className={`nav-link ${currentView === "mybookings" ? "active" : ""}`}
            onClick={() => setView("mybookings")}
          >
            My Bookings
          </button>
        </div>
      </nav>
    </>
  );
}
