

// controllers/CalendarController.js
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getTasksByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, "tasks"),
      where("dueDate", ">=", startDate),
      where("dueDate", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get Tasks by Date Range Error:", error);
    throw error;
  }
};