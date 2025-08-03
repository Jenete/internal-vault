import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getStats = async () => {
  try {
    const projectsSnap = await getDocs(collection(db, "projects"));
    const tasksSnap = await getDocs(collection(db, "tasks"));
    const documentsSnap = await getDocs(collection(db, "documents"));

    const today = new Date().toISOString().split("T")[0];

    const taskStats = {
      total: 0,
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
    };

    const assigneeStats = {}; // { Mitch: 3, Sne: 5, ... }

    tasksSnap.forEach((doc) => {
      const task = doc.data();
      const { status, assignee = "Unassigned", dueDate } = task;

      taskStats.total += 1;
      taskStats[status?.replace(/\s/g, "").toLowerCase()] += 1;

      if (dueDate && status !== "Done" && dueDate < today) {
        taskStats.overdue += 1;
      }

      assigneeStats[assignee] = (assigneeStats[assignee] || 0) + 1;
    });

    return {
      totalProjects: projectsSnap.size,
      totalTasks: taskStats.total,
      totalDocuments: documentsSnap.size,
      taskBreakdown: taskStats,
      assigneeBreakdown: assigneeStats,
    };
  } catch (error) {
    console.error("Get Stats Error:", error);
    throw error;
  }
};
