/**
 * Date normalization utility for trips
 * Ensures trip dates are always relative to the current date
 */

const BASE_DATE = "2026-03-26"; // Original base date in trips.json

const BASE_TIME = "";
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysDifference(date1Str, date2Str) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}


function addDaysToDate(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalize a single trip's date to be relative to today
 * @param {Object} trip - Trip object with date property
 * @param {String} originalBaseDate - Original base date from trips.json
 * @returns {Object} - Trip with normalized date
 */
export function normalizeTripDate(trip, originalBaseDate = BASE_DATE) {
  if (!trip.date) return trip;
  
  const today = getTodayDateString();
  const daysOffset = getDaysDifference(originalBaseDate, trip.date);
  const normalizedDate = addDaysToDate(today, daysOffset);
  
  return {
    ...trip,
    date: normalizedDate,
    originalDate: trip.originalDate || trip.date, // Store original date if not already stored
  };
}

/**
 * Normalize all trips' dates to be relative to today
 * @param {Array} trips - Array of trip objects
 * @param {String} originalBaseDate - Original base date from trips.json
 * @returns {Array} - Trips with normalized dates
 */
export function normalizeTripsForDate(trips, originalBaseDate = BASE_DATE) {
  if (!Array.isArray(trips)) return [];
  
  return trips.map(trip => normalizeTripDate(trip, originalBaseDate));
}

/**
 * Update trip dates in an object to be relative to today
 * Mutates the input object
 * @param {Object} tripsData - Object with trips array
 * @param {String} originalBaseDate - Original base date from trips.json
 * @returns {Object} - Updated trips data
 */
export function updateTripsDatesToToday(tripsData, originalBaseDate = BASE_DATE) {
  if (!tripsData || !Array.isArray(tripsData.trips)) return tripsData;
  
  tripsData.trips = tripsData.trips.map(trip => normalizeTripDate(trip, originalBaseDate));
  
  return tripsData;
}
