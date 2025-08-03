import { useEffect, useState } from "react";
import { db } from "../controllers/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [userId]);

  return { notifications };
}
