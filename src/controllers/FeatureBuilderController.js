// controllers/FeatureBuilderController.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const featuresRef = collection(db, "features");

export async function addFeature(feature) {
  try {
    const data = {
      ...feature,
      createdAt: serverTimestamp(),
      progress: feature.progress || 0,
      assignedTo: feature.assignedTo || [],
    };
    const docRef = await addDoc(featuresRef, data);
    return { id: docRef.id, ...data };
  } catch (err) {
    console.error("Add Feature Error:", err.message);
    throw new Error("Could not add feature. Please try again.");
  }
}

export async function getFeatures() {
  try {
    const snapshot = await getDocs(featuresRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Get Features Error:", err.message);
    return []; // return empty array on error
  }
}

export async function updateFeature(id, updates) {
  try {
    const featureDoc = doc(db, "features", id);
    await updateDoc(featureDoc, updates);
    return true;
  } catch (err) {
    console.error(`Update Feature (${id}) Error:`, err.message);
    throw new Error("Could not update feature. Please try again.");
  }
}

export async function deleteFeature(id) {
  try {
    const featureDoc = doc(db, "features", id);
    await deleteDoc(featureDoc);
    return true;
  } catch (err) {
    console.error(`Delete Feature (${id}) Error:`, err.message);
    throw new Error("Could not delete feature. Please try again.");
  }
}
