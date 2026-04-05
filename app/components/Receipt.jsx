'use client';

export default function Receipt({ booking, trip }) {
  if (!booking || !trip) return null;

  const generatePDF = () => {
    const html2pdf = require('html2pdf.js');
    const element = document.getElementById('receipt-content');

    const options = {
      margin: 10,
      filename: `Booking-${booking.ref}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save();
  };

  const calculateTotalPrice = () => {
    return booking.seats.length * booking.price;
  };

  const bookingDate = new Date(booking.bookedAt);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div
        id="receipt-content"
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          color: '#0a0a0f'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #e85d26', paddingBottom: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#e85d26', marginBottom: '4px' }}>RideFlow</div>
          <div style={{ fontSize: '12px', color: '#9a9488' }}>Bus Booking Receipt</div>
        </div>

        {/* Booking Reference */}
        <div style={{ background: '#ede9e0', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9a9488', marginBottom: '4px' }}>BOOKING REFERENCE</div>
          <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: '#0a0a0f' }}>
            {booking.ref}
          </div>
        </div>

        {/* Trip Details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e85d26', textTransform: 'uppercase', marginBottom: '8px' }}>Trip Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Route</div>
              <div style={{ fontWeight: '600' }}>{booking.from} → {booking.to}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Travel Date</div>
              <div style={{ fontWeight: '600' }}>{formatDate(booking.date)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Departure Time</div>
              <div style={{ fontWeight: '600' }}>{formatTime(booking.time)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Duration</div>
              <div style={{ fontWeight: '600' }}>{trip.duration} hours</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Bus Type</div>
              <div style={{ fontWeight: '600' }}>{trip.busType}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9a9488' }}>Driver</div>
              <div style={{ fontWeight: '600' }}>{trip.driver?.name || 'TBD'}</div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {trip.amenities && trip.amenities.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#e85d26', textTransform: 'uppercase', marginBottom: '8px' }}>
              Amenities
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trip.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    background: '#fff3ef',
                    border: '1px solid #e85d26',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#e85d26'
                  }}
                >
                  {amenity === 'WiFi'}
                  {amenity === 'AC'}
                  {amenity === 'Toilet'}
                  {amenity === 'USB Charger'}
                  {amenity === 'Reclining Seats'}
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Seats */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e85d26', textTransform: 'uppercase', marginBottom: '8px' }}>Seats Reserved</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {booking.seats.map(seat => (
              <div
                key={seat}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  background: '#e85d26',
                  color: '#fff',
                  fontWeight: '700',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                {seat}
              </div>
            ))}
          </div>
        </div>

        {/* Passengers */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e85d26', textTransform: 'uppercase', marginBottom: '8px' }}>Passengers</div>
          <div style={{ background: '#f5f3ee', borderRadius: '8px', padding: '12px' }}>
            {booking.seats.map((seat, idx) => {
              const passenger = booking.passengers[seat];
              return (
                <div key={seat} style={{ paddingBottom: idx < booking.seats.length - 1 ? '12px' : '0', marginBottom: idx < booking.seats.length - 1 ? '12px' : '0', borderBottom: idx < booking.seats.length - 1 ? '1px solid #ddd' : 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '12px', alignItems: 'start' }}>
                    <div style={{ background: '#e85d26', color: '#fff', padding: '6px', borderRadius: '4px', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
                      Seat {seat}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{passenger.name}</div>
                      <div style={{ fontSize: '11px', color: '#9a9488', marginBottom: '2px' }}>{passenger.email || '-'}</div>
                      <div style={{ fontSize: '11px', color: '#9a9488' }}>{passenger.phone || '-'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ borderTop: '2px solid #e85d26', paddingTop: '16px', marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '12px' }}>
            <div>{booking.seats.length} seat(s) × KES {booking.price.toLocaleString()}</div>
            <div style={{ fontWeight: '600' }}>KES {(booking.seats.length * booking.price).toLocaleString()}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', fontSize: '16px', fontWeight: '700', color: '#e85d26' }}>
            <div>Total Amount</div>
            <div>KES {calculateTotalPrice().toLocaleString()}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '11px', color: '#9a9488' }}>
          <div style={{ marginBottom: '8px' }}>Booked on {formatDate(booking.bookedAt)} at {new Date(booking.bookedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</div>
          <div>Please present this receipt at the terminal before departure</div>
          <div style={{ marginTop: '12px', fontSize: '10px', fontStyle: 'italic' }}>RideFlow Bus Booking System</div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#e85d26',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f06f3d';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#e85d26';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Download Receipt (PDF)
      </button>
    </div>
  );
}
