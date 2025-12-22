/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { api } from "../api";

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  companyName: string;
  companyType: string;
  country: string;
  logo?: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  otp: string;
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface VerifyUserRequest {
  email: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    firmName?: string;
  };
  message?: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest) {
  const response = await api.post<AuthResponse>("/api/auth/login", credentials, {
    includeAuth: false,
  });
  
  // Store token if login successful
  if (response.data?.token && !response.error) {
    api.setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest) {
  return api.post<AuthResponse>("/api/user/register", data);
}

/**
 * Request password reset (sends OTP)
 */
export async function forgotPassword(data: ForgotPasswordRequest) {
  return api.post<{ message: string }>("/api/auth/forgetPassword", data, {
    includeAuth: false,
  });
}

/**
 * Verify OTP for password reset
 */
export async function verifyOtp(data: VerifyOtpRequest) {
  const response = await api.post<{ token: string; message?: string }>(
    "/api/auth/verify-otp",
    data,
    { includeAuth: false }
  );
  
  // Store token if OTP verification successful
  if (response.data?.token && !response.error) {
    api.setAuthToken(response.data.token);
  }
  
  return response;
}

/**
 * Reset password with Bearer token (after OTP verification)
 */
export async function resetPassword(data: ResetPasswordRequest) {
  return api.post<{ message: string }>("/api/auth/resetPassword", data, {
    includeAuth: true, // Uses Bearer token from storage
  });
}

/**
 * Verify user email
 */
export async function verifyUser(data: VerifyUserRequest) {
  return api.post<{ message: string }>("/api/user/verify", data, {
    includeAuth: false,
  });
}

/**
 * Logout user
 */
export async function logout() {
  return api.post("/api/auth/logout");
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  return api.get<AuthResponse["user"]>("/api/auth/me");
}

