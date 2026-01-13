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
  token: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (data: RegisterPayload) => Promise<void>;
  verifyOtp: (data: VerifyOtp) => Promise<{ token: string }>;
  forgetPassword: (data: Partial<User>) => Promise<void>;
  resendOtp: (data: Partial<User>) => Promise<void>;
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
      const res = await api.post("auth/verify-otp", data);
      return res.data.token;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  forgetPassword: async (data: Partial<User>) => {
    try {
      set({ isLoading: true });
      await api.post("auth/forgetPassword", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resendOtp: async (data: Partial<User>) => {
    try {
      set({ isLoading: true });
      await api.post("auth/resendOTP", data);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resetPassword: async (data: ResetPassword) => {
    try {
      set({ isLoading: true });
      await api.post(
        "auth/resetPassword",
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  changePassword: async (data: ResetPassword) => {
    try {
      set({ isLoading: true });
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
