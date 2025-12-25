import api from "@/utils/api";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: string;
  phone: string;
}
export interface RegisterPayload {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
export interface VerifyOtp {
  email: string;
  otp: string;
}
export interface ResetPassword {
  password: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (data: RegisterPayload) => Promise<void>;
  verifyOtp: (data: VerifyOtp) => Promise<void>;
  forgetPassword: (data: Partial<User>) => Promise<void>;
  resetPassword: (data: ResetPassword) => Promise<void>;
  changePassword: (data: ResetPassword) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  register: async (data: RegisterPayload) => {
    set({ isLoading: true });

    try {
      const response = await api.post("/auth/signUp", data);
      set({
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  verifyOtp: async (data: VerifyOtp) => {
    set({ isLoading: true });
    try {
      await api.post("auth/verify-otp", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  forgetPassword: async (data: Partial<User>) => {
    set({ isLoading: true });
    try {
      await api.post("auth/forgetPassword", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resetPassword: async (data: ResetPassword) => {
    set({ isLoading: true });
    try {
      await api.post("auth/resetPassword", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  changePassword: async (data: ResetPassword) => {
    set({ isLoading: true });
    try {
      await api.post("auth/changePassword", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: (updatedUser: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },
}));
