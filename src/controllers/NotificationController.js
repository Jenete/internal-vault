// controllers/NotificationController.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

// Log an activity (send a notification)
export const logNotification = async (userId, message, type, relatedData = {}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      type,
      relatedData,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (err) {
    console.error("Failed to log notification:", err);
  }
};

// Real-time listener
export const listenToUserNotifications = (userId, callback) => {
  try {
    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const nots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(nots);
    });
  } catch (err) {
    console.error("Notification listener error:", err);
  }
};

// Mark as read
export const markNotificationAsRead = async (notifId) => {
  try {
    const ref = doc(db, "notifications", notifId);
    await updateDoc(ref, { read: true });
  } catch (err) {
    console.error("Failed to mark as read:", err);
  }
};
