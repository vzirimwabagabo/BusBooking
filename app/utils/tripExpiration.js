import { fetchStore, saveStore } from "./dataStore";

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
 * Reset seats for an expired trip
 */
export async function resetTripSeatsAsync(tripId, store) {
  if (store.takenSeats[tripId] && store.takenSeats[tripId].length > 0) {
    store.takenSeats[tripId] = [];
    return true;
  }
  return false;
}

/**
 * Check all trips and reset seats for expired trips async
 */
export async function handleExpiredTripsAsync(trips) {
  if (!Array.isArray(trips)) return;
  
  const store = await fetchStore();
  let updated = false;
  
  trips.forEach((trip) => {
    if (trip.id && isTripExpired(trip.date)) {
      if (store.takenSeats[trip.id] && store.takenSeats[trip.id].length > 0) {
        store.takenSeats[trip.id] = [];
        updated = true;
      }
    }
  });

  if (updated) {
    await saveStore(store);
  }
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
