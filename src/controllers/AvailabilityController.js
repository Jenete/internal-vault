import { db } from "./firebaseConfig";
import {
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const AVAILABILITY_COLLECTION = "team_availability";

export async function saveAvailability(userKey, data) {
  const ref = doc(db, AVAILABILITY_COLLECTION, userKey);
  await setDoc(ref, { availability: data }, { merge: true });
}

export const getAvailability = async () => {
  const snapshot = await getDocs(collection(db, AVAILABILITY_COLLECTION));
  return snapshot.docs.map((doc) => ({
    key: doc.id,
    ...doc.data(),
  }));
};

export function suggestMeetingTime(availabilityData = {}) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const suggestions = [];

  for (let day of days) {
    const allSlots = Object.values(availabilityData)
      .map((user) => user?.[day])
      .filter((slot) => slot?.start && slot?.end);

    if (allSlots.length === Object.keys(availabilityData).length) {
      const latestStart = allSlots.map(s => s.start).sort().pop();
      const earliestEnd = allSlots.map(s => s.end).sort()[0];

      if (latestStart < earliestEnd) {
        suggestions.push({ day, start: latestStart, end: earliestEnd });
      }
    }
  }

  return suggestions;
}

