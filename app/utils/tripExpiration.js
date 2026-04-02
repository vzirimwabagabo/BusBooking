
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 
 * @param {string} tripDate - Date in YYYY-MM-DD format
 * @returns {boolean} - true if trip date has passed
 */
export function isTripExpired(tripDate) {
  const today = getTodayDate();
  return tripDate < today;
}

/**
 * Reset seats for an expired trip (make them available again for the next trip)
 * @param {string} tripId - The trip ID
 */
export function resetTripSeats(tripId) {
  try {
    const tripStorageKey = `rideflow_taken_${tripId}`;
    localStorage.removeItem(tripStorageKey);
    console.log(`Seats reset for expired trip: ${tripId}`);
  } catch (err) {
    console.warn(`Failed to reset seats for trip ${tripId}:`, err);
  }
}

/**
 * Check all trips and reset seats for expired trips
 * This should be called when the app initializes or when loading trips
 * @param {Array} trips - Array of trip objects
 */
export function handleExpiredTrips(trips) {
  if (!Array.isArray(trips)) return;
  
  trips.forEach((trip) => {
    if (trip.id && isTripExpired(trip.date)) {
      resetTripSeats(trip.id);
    }
  });
}

/**
 * Get the next trip date (7 days from current expired trip date)
 * @param {string} tripDate - Current trip date in YYYY-MM-DD format
 * @returns {string} - Next trip date in YYYY-MM-DD format
 */
export function getNextTripDate(tripDate) {
  const date = new Date(tripDate);
  date.setDate(date.getDate() + 7); // Add 7 days for next week
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a trip's date has passed and return its status
 * @param {string} tripDate - Trip date in YYYY-MM-DD format
 * @param {string} tripId - Trip ID
 * @returns {Object} - { expired: boolean, shouldResetSeats: boolean }
 */
export function checkTripStatus(tripDate, tripId) {
  const expired = isTripExpired(tripDate);
  return {
    expired,
    date: tripDate,
    nextAvailableDate: expired ? getNextTripDate(tripDate) : null,
  };
}
