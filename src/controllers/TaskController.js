

// controllers/TaskController.js
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { logNotification } from "../controllers/NotificationController";


export const getTasksByProject = async (projectId) => {
  try {
    const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get Tasks Error:", error);
    throw error;
  }
};


const createNotification = async (createdTask, user, action) =>{
      // After task created:
      const mentioned = createdTask?.description?.match(/@(\w+)/g); // e.g. @amahle
      if (mentioned) {
        mentioned.forEach(async (tag) => {
          const username = tag.replace("@", "").toLowerCase();
          const userId = username; // You’d create this
          if (userId) {
            await logNotification(userId, `You were mentioned in a task: "${createdTask.title}"`, "mention", {
              taskId: createdTask.id
            });
          }
        });
      }
      else {
        await logNotification('admin', `A new task has been ${action} "${createdTask.title}" by ${user}`, "task", {
              taskId: createdTask.id
            });
      }

}



export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    createNotification(taskData, taskData?.createdBy, 'added');
    return docRef.id;
  } catch (error) {
    console.error("Create Task Error:", error);
    throw error;
  }

};

export const updateTask = async (taskId, updates, updatedBy) => {
  try {
    await updateDoc(doc(db, "tasks", taskId), updates);
    createNotification(updates, updatedBy, 'updated');
  } catch (error) {
    console.error("Update Task Error:", error);
    throw error;
  }
};

export const deleteTask = async (taskId, deletedBy) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    createNotification(taskId, deletedBy, 'deleted');
  } catch (error) {
    console.error("Delete Task Error:", error);
    throw error;
  }
};