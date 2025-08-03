// controllers/CompanyInfoController.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

const companyInfoRef = collection(db, "companyInfo");

export const getCompanyInfo = async () => {
  try {
    const snapshot = await getDocs(companyInfoRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching company info:", error);
    return [];
  }
};

export const addCompanyInfo = async (entry) => {
  try {
    return await addDoc(companyInfoRef, {
      ...entry,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error adding company info:", error);
    throw error;
  }
};

export const updateCompanyInfo = async (id, updatedEntry) => {
  try {
    const docRef = doc(db, "companyInfo", id);
    await updateDoc(docRef, {
      ...updatedEntry,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating company info:", error);
    throw error;
  }
};

export const deleteCompanyInfo = async (id) => {
  try {
    const docRef = doc(db, "companyInfo", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting company info:", error);
    throw error;
  }
};