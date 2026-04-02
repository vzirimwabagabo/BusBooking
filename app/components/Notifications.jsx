"use client";
import { useState, useEffect } from "react";
import { getUnreadNotifications, markAsRead, dismissNotification } from "../utils/notificationManager";

const styles = `
  .notifications-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .notification {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #e85d26;
    animation: slideIn 0.3s ease-out;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .notification.trip-reminder {
    border-left-color: #2d6be4;
  }

  .notification.trip-ready {
    border-left-color: #4caf50;
  }

  .notification.booking-confirmed {
    border-left-color: #ff9800;
  }

  .notification-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: #0a0a0f;
    margin-bottom: 4px;
    font-family: 'Poppins', sans-serif;
  }

  .notification-message {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.4;
  }

  .notification-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .notification-close:hover {
    color: #333;
  }

  @media (max-width: 480px) {
    .notifications-container {
      right: 12px;
      left: 12px;
      max-width: none;
      top: 12px;
    }
  }
`;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load unread notifications
    const unread = getUnreadNotifications();
    setNotifications(unread);

    // Auto-dismiss after 5 seconds
    const timers = unread.map(notif => {
      return setTimeout(() => {
        dismissNotification(notif.id);
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
      }, 5000);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleClose = (notifId) => {
    dismissNotification(notifId);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'trip_reminder':
        return '🚌';
      case 'trip_ready':
        return '✅';
      case 'booking_confirmed':
        return '🎫';
      case 'seat_available':
        return '🪑';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="notifications-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            <div className="notification-icon">{getIcon(notif.type)}</div>
            <div className="notification-content">
              <div className="notification-title">{notif.title}</div>
              <div className="notification-message">{notif.message}</div>
            </div>
            <button 
              className="notification-close"
              onClick={() => handleClose(notif.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
