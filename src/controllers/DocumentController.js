

// controllers/DocumentController.js
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const uploadDocument = async (file, metadata) => {
  try {
    const storageRef = ref(storage, `documents/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const docRef = await addDoc(collection(db, "documents"), {
      ...metadata,
      fileName: file.name,
      fileUrl: url,
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Upload Document Error:", error);
    throw error;
  }
};

export const getDocuments = async () => {
  try {
    const snapshot = await getDocs(collection(db, "documents"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get Documents Error:", error);
    throw error;
  }
};

export const deleteDocument = async (docId, fileName) => {
  try {
    const storageRef = ref(storage, `documents/${fileName}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, "documents", docId));
  } catch (error) {
    console.error("Delete Document Error:", error);
    throw error;
  }
};

