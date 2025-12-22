/**
 * Categories API service
 * Handles all category-related API calls
 */

import { api } from "../api";
import { PaginatedResponse } from "./people";

export interface Category {
  _id: string;
  id?: string; // Alias for _id
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

/**
 * Get all categories
 * Uses GET /api/category endpoint
 * Returns paginated response
 */
export async function getCategories(page?: number, limit?: number): Promise<PaginatedResponse<Category>> {
  try {
    // Build URL - if page/limit not provided, don't add query params to get all
    const url = page !== undefined && limit !== undefined 
      ? `/api/category?page=${page}&limit=${limit}`
      : `/api/category`;
    
    const response = await api.get<PaginatedResponse<Category>>(url, {
      includeAuth: true,
    });
    
    // Handle paginated response
    if (response.data && 'docs' in response.data) {
      // Map _id to id for consistency
      const mappedData = {
        ...response.data,
        docs: response.data.docs.map((category) => ({
          ...category,
          id: category._id || category.id,
        })),
      };
      return mappedData;
    }
    
    // Fallback: if response is already an array, convert to paginated format
    if (Array.isArray(response.data)) {
      const arrayData = response.data as Category[];
      const defaultLimit = limit ?? arrayData.length;
      const defaultPage = page ?? 1;
      return {
        docs: arrayData.map((category) => ({
          ...category,
          id: category._id || category.id,
        })),
        totalDocs: arrayData.length,
        limit: defaultLimit,
        totalPages: Math.ceil(arrayData.length / defaultLimit),
        page: defaultPage,
        pagingCounter: (defaultPage - 1) * defaultLimit + 1,
        hasPrevPage: defaultPage > 1,
        hasNextPage: false,
        prevPage: defaultPage > 1 ? defaultPage - 1 : null,
        nextPage: null,
      };
    }
    
    // Return empty paginated response
    return {
      docs: [],
      totalDocs: 0,
      limit: limit ?? 10,
      totalPages: 1,
      page: page ?? 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  } catch (error) {
    // Return empty paginated response on error
    console.warn("API call failed, returning empty paginated response:", error);
    return {
      docs: [],
      totalDocs: 0,
      limit: limit ?? 10,
      totalPages: 1,
      page: page ?? 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

/**
 * Get a single category by ID
 * Uses GET /api/category/{id} endpoint
 */
export async function getCategory(id: string): Promise<Category> {
  const response = await api.get<Category>(`/api/category/${id}`, {
    includeAuth: true,
  });
  
  // Map _id to id for consistency
  if (response.data) {
    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  }
  
  return response.data!;
}

/**
 * Create a new category
 * Uses POST /api/category endpoint
 */
export async function createCategory(
  data: CreateCategoryRequest
): Promise<Category> {
  const response = await api.post<Category>("/api/category", data, {
    includeAuth: true,
  });
  
  // Map _id to id for consistency
  if (response.data) {
    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  }
  
  return response.data!;
}

/**
 * Update an existing category
 * Uses PUT /api/category/{id} endpoint
 */
export async function updateCategory(
  data: UpdateCategoryRequest
): Promise<Category> {
  const { id, ...updateData } = data;
  const response = await api.put<Category>(`/api/category/${id}`, updateData, {
    includeAuth: true,
  });
  
  // Map _id to id for consistency
  if (response.data) {
    return {
      ...response.data,
      id: response.data._id || response.data.id,
    };
  }
  
  return response.data!;
}

/**
 * Delete a category
 * Uses DELETE /api/category/{id} endpoint
 */
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/category/${id}`, {
    includeAuth: true,
  });
}

