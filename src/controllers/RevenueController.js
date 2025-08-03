// controllers/RevenueController.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

// Add income or expense
export const addRevenueEntry = async ({ type, amount, user, reason }) => {
  try {
    const docRef = await addDoc(collection(db, "revenue"), {
      type,
      amount: Number(amount),
      user,
      reason,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error("Add Revenue Entry Error:", err);
    throw err;
  }
};

// Get stats
export const getRevenueStats = async () => {
  try {
    const q = query(collection(db, "revenue"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    let totalIncome = 0;
    let totalExpenses = 0;
    let breakdown = {};

    entries.forEach((e) => {
      if (e.type === "income") totalIncome += e.amount;
      if (e.type === "expense") totalExpenses += e.amount;

      const key = e.user || "Unknown";
      if (!breakdown[key]) breakdown[key] = 0;
      breakdown[key] += e.amount * (e.type === "income" ? 1 : -1);
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      entries,
      breakdown
    };
  } catch (err) {
    console.error("Get Revenue Stats Error:", err);
    throw err;
  }
};
/**
 * Approves a revenue entry by setting approved = true.
 * @param {string} id - The document ID of the entry to approve.
 * @param {string} approver - (Optional) Name of person approving.
 */
export const approveRevenueEntry = async (id, approver = "") => {
  try {
    const entryRef = doc(db, "revenue", id);
    await updateDoc(entryRef, {
      approved: true,
      approvedAt: serverTimestamp(),
      approvedBy: approver || "Admin"
    });
  } catch (error) {
    console.error("Approve Revenue Error:", error);
    throw error;
  }
};