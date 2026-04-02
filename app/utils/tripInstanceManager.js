/**
 * Trip instance manager - handles trip scheduling and status tracking
 * Stores trip instances with their dates and availability
 */

const STORAGE_KEY = "rideflow_trip_instances";
const STATUS = {
  UPCOMING: "upcoming",
  IN_TRANSIT: "in-transit",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get a trip instance key (tripId + date)
 */
export function getTripInstanceKey(tripId, date) {
  return `${tripId}_${date}`;
}

/**
 * Create or get a trip instance
 */
export function getOrCreateTripInstance(tripId, date, totalSeats = 48) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    
    if (!instances[key]) {
      instances[key] = {
        tripId,
        date,
        totalSeats,
        bookedSeats: [],
        status: getStatusForDate(date),
        createdAt: new Date().toISOString(),
        passengers: {} // seat -> passenger details
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
    }
    
    return instances[key];
  } catch (err) {
    console.warn("Failed to get/create trip instance:", err);
    return null;
  }
}

/**
 * Get available seats for a specific trip date
 */
export function getAvailableSeats(tripId, date, totalSeats = 48) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    const instance = instances[key];
    
    if (!instance) {
      return totalSeats; // All seats available if instance doesn't exist
    }
    
    return totalSeats - instance.bookedSeats.length;
  } catch (err) {
    console.warn("Failed to get available seats:", err);
    return totalSeats;
  }
}

/**
 * Get taken seats for a specific trip date
 */
export function getTakenSeats(tripId, date) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    const instance = instances[key];
    
    return instance?.bookedSeats || [];
  } catch (err) {
    console.warn("Failed to get taken seats:", err);
    return [];
  }
}

/**
 * Book seats for a trip date
 */
export function bookSeatsForDate(tripId, date, seats, passengerDetails = {}, totalSeats = 48) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    
    let instance = instances[key] || {
      tripId,
      date,
      totalSeats,
      bookedSeats: [],
      status: getStatusForDate(date),
      passengers: {}
    };
    
    // Check for conflicts
    const conflicts = seats.filter(s => instance.bookedSeats.includes(s));
    if (conflicts.length > 0) {
      throw new Error(`Seats already booked: ${conflicts.join(", ")}`);
    }
    
    // Book seats
    instance.bookedSeats.push(...seats);
    seats.forEach(seat => {
      instance.passengers[seat] = passengerDetails[seat] || {};
    });
    
    instances[key] = instance;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
    
    return instance;
  } catch (err) {
    console.warn("Failed to book seats:", err);
    throw err;
  }
}

/**
 * Release seats for a trip date
 */
export function releaseSeatsForDate(tripId, date, seats) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    
    if (!instances[key]) {
      return;
    }
    
    const instance = instances[key];
    instance.bookedSeats = instance.bookedSeats.filter(s => !seats.includes(s));
    seats.forEach(seat => {
      delete instance.passengers[seat];
    });
    
    instances[key] = instance;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
  } catch (err) {
    console.warn("Failed to release seats:", err);
  }
}

/**
 * Determine trip status based on date
 */
export function getStatusForDate(tripDate) {
  const today = getTodayDate();
  const now = new Date();
  
  if (tripDate < today) {
    return STATUS.COMPLETED;
  } else if (tripDate === today) {
    // Check time - for now just mark as upcoming
    return STATUS.UPCOMING;
  }
  
  return STATUS.UPCOMING;
}

/**
 * Update trip statuses based on current date
 */
export function updateTripStatuses() {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    let updated = false;
    
    Object.keys(instances).forEach(key => {
      const instance = instances[key];
      const newStatus = getStatusForDate(instance.date);
      
      if (instance.status !== newStatus) {
        instance.status = newStatus;
        updated = true;
      }
    });
    
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(instances));
    }
  } catch (err) {
    console.warn("Failed to update trip statuses:", err);
  }
}

/**
 * Get all upcoming trips for notifications
 */
export function getUpcomingTrips() {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = getTodayDate();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    
    return Object.values(instances)
      .filter(t => t.date >= today && t.date <= tomorrow && t.bookedSeats.length > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.warn("Failed to get upcoming trips:", err);
    return [];
  }
}

/**
 * Get trip instance by key
 */
export function getTripInstance(tripId, date) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const key = getTripInstanceKey(tripId, date);
    return instances[key] || null;
  } catch (err) {
    console.warn("Failed to get trip instance:", err);
    return null;
  }
}

/**
 * Get all instances for a trip
 */
export function getTripInstances(tripId) {
  try {
    const instances = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.values(instances).filter(t => t.tripId === tripId);
  } catch (err) {
    console.warn("Failed to get trip instances:", err);
    return [];
  }
}

export { STATUS };
