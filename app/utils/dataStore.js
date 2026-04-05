export async function fetchStore() {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    const data = await res.json();
    return {
      bookings: data.bookings || [],
      takenSeats: data.takenSeats || {}
    };
  } catch (err) {
    console.error('Failed to fetch from store API:', err);
    return { bookings: [], takenSeats: {} };
  }
}

export async function saveStore(data) {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Failed to save to store API:', err);
  }
}
