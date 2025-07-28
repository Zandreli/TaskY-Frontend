import api from "./api";

export interface Task {
  id: string;
  title: string;
  description: string;
  isDeleted: boolean;
  isCompleted: boolean;
  dateCreated: string;
  dateUpdated: string;
  userId: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
}

export const taskService = {
  getActiveTasks: () => api.get<{ message: string; tasks: Task[] }>("/tasks"),

  getCompletedTasks: () =>
    api.get<{ message: string; tasks: Task[] }>("/tasks/completed"),

  getDeletedTasks: () =>
    api.get<{ message: string; tasks: Task[] }>("/tasks/trash"),

  getTaskById: (id: string) =>
    api.get<{ message: string; task: Task }>(`/tasks/${id}`),

  createTask: (data: CreateTaskData) =>
    api.post<{ message: string; task: Task }>("/tasks", data),

  updateTask: (id: string, data: UpdateTaskData) =>
    api.patch<{ message: string; task: Task }>(`/tasks/${id}`, data),

  deleteTask: (id: string) =>
    api.delete<{ message: string; task: Task }>(`/tasks/${id}`),

  restoreTask: (id: string) =>
    api.patch<{ message: string; task: Task }>(`/tasks/restore/${id}`),

  completeTask: (id: string) =>
    api.patch<{ message: string; task: Task }>(`/tasks/complete/${id}`),

  incompleteTask: (id: string) =>
    api.patch<{ message: string; task: Task }>(`/tasks/incomplete/${id}`),
};
