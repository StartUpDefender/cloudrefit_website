/**
 * Companies API service
 * Handles all company-related API calls
 */

import { api } from "../api";
import { PaginatedResponse } from "./people";

export interface Company {
  _id: string;
  id?: string; // Alias for _id
  name?: string;
  type?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateCompanyRequest {
  name?: string;
  type?: string;
  country?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string;
}

/**
 * Get all companies
 * Uses GET /api/company endpoint
 * If page and limit are not provided, fetches all companies without pagination
 * Returns paginated response
 */
export async function getCompanies(page?: number, limit?: number): Promise<PaginatedResponse<Company>> {
  try {
    // Build URL - if page/limit not provided, don't add query params to get all
    const url = page !== undefined && limit !== undefined 
      ? `/api/company?page=${page}&limit=${limit}`
      : `/api/company`;
    
    const response = await api.get<PaginatedResponse<Company>>(url, {
      includeAuth: true,
    });
    
    // Handle paginated response
    if (response.data && 'docs' in response.data) {
      // Map _id to id for consistency
      const mappedData = {
        ...response.data,
        docs: response.data.docs.map((company) => ({
          ...company,
          id: company._id || company.id,
        })),
      };
      return mappedData;
    }
    
    // Fallback: if response is already an array, convert to paginated format
    if (Array.isArray(response.data)) {
      const arrayData = response.data as Company[];
      const defaultLimit = limit ?? arrayData.length;
      const defaultPage = page ?? 1;
      return {
        docs: arrayData.map((company) => ({
          ...company,
          id: company._id || company.id,
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
 * Get a single company by ID
 * Uses GET /api/company/{id} endpoint
 */
export async function getCompany(id: string): Promise<Company> {
  const response = await api.get<Company>(`/api/company/${id}`, {
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
 * Create a new company
 * Uses POST /api/company endpoint
 */
export async function createCompany(
  data: CreateCompanyRequest
): Promise<Company> {
  const response = await api.post<Company>("/api/company", data, {
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
 * Update an existing company
 * Uses PUT /api/company/{id} endpoint
 */
export async function updateCompany(
  data: UpdateCompanyRequest
): Promise<Company> {
  const { id, ...updateData } = data;
  const response = await api.put<Company>(`/api/company/${id}`, updateData, {
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
 * Delete a company
 * Uses DELETE /api/company/{id} endpoint
 */
export async function deleteCompany(id: string): Promise<void> {
  await api.delete(`/api/company/${id}`, {
    includeAuth: true,
  });
}

