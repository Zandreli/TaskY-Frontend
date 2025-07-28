import api from "./api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  dateJoined: string;
  lastProfileUpdate: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export const userService = {
  getProfile: () => api.get<{ message: string; user: User }>("/user"),

  updateProfile: (data: UpdateUserData) =>
    api.patch<{ message: string; user: User }>("/user", data),

  uploadAvatar: (formData: FormData) =>
    api.post<{ message: string; user: User }>("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
