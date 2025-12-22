/**
 * Utility functions for error handling and message extraction
 */

import { ApiResponse } from "./api";

/**
 * Extract error message from API response
 */
export function extractErrorMessage<T = unknown>(
  response: ApiResponse<T>
): string | null {
  // Check if there's an error property
  if (response.error) {
    return response.error;
  }

  // Check if response data has a message property
  if (response.data && typeof response.data === "object") {
    const data = response.data as Record<string, unknown>;
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
    
    // Check for error property in data
    if ("error" in data && typeof data.error === "string") {
      return data.error;
    }
  }

  // Check response.message
  if (response.message) {
    return response.message;
  }

  // Default error for non-200 status
  if (response.status >= 400) {
    return "An error occurred. Please try again.";
  }

  return null;
}

/**
 * Extract success message from API response
 */
export function extractSuccessMessage<T = unknown>(
  response: ApiResponse<T>
): string | null {
  // Check if response data has a message property (success message)
  if (response.data && typeof response.data === "object") {
    const data = response.data as Record<string, unknown>;
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  // Check response.message
  if (response.message) {
    return response.message;
  }

  return null;
}

/**
 * Check if response indicates an error
 */
export function isErrorResponse<T = unknown>(
  response: ApiResponse<T>
): boolean {
  return (
    !!response.error ||
    response.status >= 400 ||
    (response.data &&
      typeof response.data === "object" &&
      "error" in response.data)
  );
}
