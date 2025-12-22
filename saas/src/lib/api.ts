/**
 * API utility functions
 * Centralized API client for making requests to the backend
 */

import { config } from "./config";

/**
 * API Response type
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * API Client class for making HTTP requests
 */
class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  /**
   * Get full URL for an endpoint
   */
  private getUrl(endpoint: string): string {
    return config.getApiUrl(endpoint);
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    if (typeof globalThis.window === "undefined") return null;
    return globalThis.window.localStorage.getItem("auth-token");
  }

  /**
   * Set auth token in storage
   */
  setAuthToken(token: string): void {
    if (typeof globalThis.window === "undefined") return;
    globalThis.window.localStorage.setItem("auth-token", token);
  }

  /**
   * Clear auth token from storage
   */
  clearAuthToken(): void {
    if (typeof globalThis.window === "undefined") return;
    globalThis.window.localStorage.removeItem("auth-token");
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(customHeaders?: HeadersInit, includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    };

    // Add Authorization header if token exists and auth is requested
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options?: RequestInit & { includeAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const includeAuth = options?.includeAuth !== false;
      const response = await fetch(this.getUrl(endpoint), {
        method: "GET",
        headers: this.getHeaders(options?.headers, includeAuth),
        ...options,
      });

      const data = await response.json().catch(() => null);

      // If response is not ok, try to extract error message
      if (!response.ok) {
        const errorMessage =
          (data && typeof data === "object" && "message" in data
            ? (data as { message: string }).message
            : null) ||
          (data && typeof data === "object" && "error" in data
            ? (data as { error: string }).error
            : null) ||
          `Request failed with status ${response.status}`;

        return {
          data: data as T,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      };
    }
  }

  /**
   * Make a POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit & { includeAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const includeAuth = options?.includeAuth !== false;
      const response = await fetch(this.getUrl(endpoint), {
        method: "POST",
        headers: this.getHeaders(options?.headers, includeAuth),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      const data = await response.json().catch(() => null);

      // If response is not ok, try to extract error message
      if (!response.ok) {
        const errorMessage =
          (data && typeof data === "object" && "message" in data
            ? (data as { message: string }).message
            : null) ||
          (data && typeof data === "object" && "error" in data
            ? (data as { error: string }).error
            : null) ||
          `Request failed with status ${response.status}`;

        return {
          data: data as T,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      };
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit & { includeAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const includeAuth = options?.includeAuth !== false;
      const response = await fetch(this.getUrl(endpoint), {
        method: "PUT",
        headers: this.getHeaders(options?.headers, includeAuth),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      const data = await response.json().catch(() => null);

      // If response is not ok, try to extract error message
      if (!response.ok) {
        const errorMessage =
          (data && typeof data === "object" && "message" in data
            ? (data as { message: string }).message
            : null) ||
          (data && typeof data === "object" && "error" in data
            ? (data as { error: string }).error
            : null) ||
          `Request failed with status ${response.status}`;

        return {
          data: data as T,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      };
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: RequestInit & { includeAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const includeAuth = options?.includeAuth !== false;
      const response = await fetch(this.getUrl(endpoint), {
        method: "DELETE",
        headers: this.getHeaders(options?.headers, includeAuth),
        ...options,
      });

      const data = await response.json().catch(() => null);

      // If response is not ok, try to extract error message
      if (!response.ok) {
        const errorMessage =
          (data && typeof data === "object" && "message" in data
            ? (data as { message: string }).message
            : null) ||
          (data && typeof data === "object" && "error" in data
            ? (data as { error: string }).error
            : null) ||
          `Request failed with status ${response.status}`;

        return {
          data: data as T,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      };
    }
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export convenience functions
export const apiGet = <T = unknown>(endpoint: string, options?: RequestInit) =>
  api.get<T>(endpoint, options);

export const apiPost = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
) => api.post<T>(endpoint, body, options);

export const apiPut = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
) => api.put<T>(endpoint, body, options);

export const apiDelete = <T = unknown>(endpoint: string, options?: RequestInit) =>
  api.delete<T>(endpoint, options);

