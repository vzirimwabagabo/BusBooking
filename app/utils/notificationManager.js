/**
 * Notification system for trip updates
 */

const NOTIFICATIONS_KEY = "rideflow_notifications";

export const NOTIFICATION_TYPES = {
  TRIP_REMINDER: "trip_reminder",
  TRIP_READY: "trip_ready",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  SEAT_AVAILABLE: "seat_available"
};

/**
 * Create a notification
 */
export function createNotification(type, title, message, data = {}) {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    data,
    createdAt: new Date().toISOString(),
    read: false,
    dismissed: false
  };
}

/**
 * Add notification to storage
 */
export function addNotification(notification) {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    notifications.push(notification);
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.shift();
    }
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notification;
  } catch (err) {
    console.warn("Failed to add notification:", err);
    return null;
  }
}

/**
 * Get all unread notifications
 */
export function getUnreadNotifications() {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    return notifications.filter(n => !n.read && !n.dismissed);
  } catch (err) {
    console.warn("Failed to get notifications:", err);
    return [];
  }
}

/**
 * Get all notifications
 */
export function getAllNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
  } catch (err) {
    console.warn("Failed to get all notifications:", err);
    return [];
  }
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId) {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  } catch (err) {
    console.warn("Failed to mark notification as read:", err);
  }
}

/**
 * Dismiss notification
 */
export function dismissNotification(notificationId) {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.dismissed = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  } catch (err) {
    console.warn("Failed to dismiss notification:", err);
  }
}

/**
 * Create trip reminder notification
 */
export function createTripReminder(trip, daysUntil) {
  const message = daysUntil === 0 
    ? `Your trip from ${trip.from} to ${trip.to} departs today at ${trip.time}! Be ready!`
    : `Your trip from ${trip.from} to ${trip.to} is coming up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!`;
  
  return createNotification(
    NOTIFICATION_TYPES.TRIP_REMINDER,
    `${trip.from} → ${trip.to}`,
    message,
    { tripId: trip.id, date: trip.date }
  );
}

/**
 * Create trip ready notification (trip date reached)
 */
export function createTripReadyNotification(trip) {
  return createNotification(
    NOTIFICATION_TYPES.TRIP_READY,
    "Trip Status Update",
    `Your trip from ${trip.from} to ${trip.to} on ${trip.date} has been completed. Thank you for traveling with us!`,
    { tripId: trip.id, date: trip.date }
  );
}

/**
 * Create booking confirmation notification
 */
export function createBookingConfirmation(booking) {
  return createNotification(
    NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    "Booking Confirmed",
    `Your booking (${booking.ref}) for ${booking.from} → ${booking.to} on ${booking.date} is confirmed. Seats: ${booking.seats.join(", ")}`,
    { bookingRef: booking.ref, tripId: booking.tripId }
  );
}

/**
 * Clear old notifications
 */
export function clearOldNotifications(daysOld = 7) {
  try {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filtered = notifications.filter(n => {
      const notifDate = new Date(n.createdAt);
      return notifDate > cutoffDate;
    });
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn("Failed to clear old notifications:", err);
  }
}
