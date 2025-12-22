/**
 * Subcategories API service
 * Handles all subcategory-related API calls
 */

import { api } from "../api";
import { PaginatedResponse } from "./people";

export interface Subcategory {
  _id: string;
  id?: string; // Alias for _id
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateSubcategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateSubcategoryRequest extends Partial<CreateSubcategoryRequest> {
  id: string;
}

/**
 * Get all subcategories
 * Uses GET /api/subcategory endpoint
 * Returns paginated response
 */
export async function getSubcategories(page?: number, limit?: number): Promise<PaginatedResponse<Subcategory>> {
  try {
    // Build URL - if page/limit not provided, don't add query params to get all
    const url = page !== undefined && limit !== undefined 
      ? `/api/subcategory?page=${page}&limit=${limit}`
      : `/api/subcategory`;
    
    const response = await api.get<PaginatedResponse<Subcategory>>(url, {
      includeAuth: true,
    });
    
    // Handle paginated response
    if (response.data && 'docs' in response.data) {
      // Map _id to id for consistency
      const mappedData = {
        ...response.data,
        docs: response.data.docs.map((subcategory) => ({
          ...subcategory,
          id: subcategory._id || subcategory.id,
        })),
      };
      return mappedData;
    }
    
    // Fallback: if response is already an array, convert to paginated format
    if (Array.isArray(response.data)) {
      const arrayData = response.data as Subcategory[];
      const defaultLimit = limit ?? arrayData.length;
      const defaultPage = page ?? 1;
      return {
        docs: arrayData.map((subcategory) => ({
          ...subcategory,
          id: subcategory._id || subcategory.id,
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
 * Get a single subcategory by ID
 * Uses GET /api/subcategory/{id} endpoint
 */
export async function getSubcategory(id: string): Promise<Subcategory> {
  const response = await api.get<Subcategory>(`/api/subcategory/${id}`, {
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
 * Create a new subcategory
 * Uses POST /api/subcategory endpoint
 */
export async function createSubcategory(
  data: CreateSubcategoryRequest
): Promise<Subcategory> {
  const response = await api.post<Subcategory>("/api/subcategory", data, {
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
 * Update an existing subcategory
 * Uses PUT /api/subcategory/{id} endpoint
 */
export async function updateSubcategory(
  data: UpdateSubcategoryRequest
): Promise<Subcategory> {
  const { id, ...updateData } = data;
  const response = await api.put<Subcategory>(`/api/subcategory/${id}`, updateData, {
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
 * Delete a subcategory
 * Uses DELETE /api/subcategory/{id} endpoint
 */
export async function deleteSubcategory(id: string): Promise<void> {
  await api.delete(`/api/subcategory/${id}`, {
    includeAuth: true,
  });
}

