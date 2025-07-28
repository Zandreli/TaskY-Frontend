import api from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  loginIdentifier: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  register: (data: RegisterData) => api.post('/auth/register', data),

  login: (data: LoginData) => api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  updatePassword: (data: UpdatePasswordData) => api.patch('/auth/password', data),
};

