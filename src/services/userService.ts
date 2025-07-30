import api from "./api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  avatar?: string;
  dateJoined: Date;
  lastProfileUpdate: Date;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  emailAddress?: string;
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
