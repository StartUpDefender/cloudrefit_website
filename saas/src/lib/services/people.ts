/**
 * People API service
 * Handles all people-related API calls
 */

import { api } from "../api";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  jobTitle?: string;
  company?: string;
  city?: string;
  country?: string;
  website?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  fullName?: string;
  jobTitle?: string;
  company?: string;
  city?: string;
  country?: string;
  website?: string;
  mobile?: string;
  phone?: string;
  email?: string;
}

/**
 * Create Client Request - matches POST /api/client endpoint
 * Used in: http://localhost:3000/dashboard/people
 */
export interface CreateClientRequest {
  userName: string;
  phone: string;
  email: string;
  password: string;
  company: string;
  category: string;
  subcategory: string;
  emailURL?: string;
  city?: string;
  country?: string;
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {
  id: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Get all people/clients with pagination
 * Uses GET /api/client endpoint
 * Returns paginated response
 */
export async function getPeople(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Person>> {
  try {
    const response = await api.get<PaginatedResponse<Person>>(`/api/client?page=${page}&limit=${limit}`, {
      includeAuth: true,
    });
    
    // Handle paginated response
    if (response.data && 'docs' in response.data) {
      return response.data;
    }
    
    // Fallback: if response is already an array, convert to paginated format
    if (Array.isArray(response.data)) {
      const arrayData = response.data as Person[];
      return {
        docs: arrayData,
        totalDocs: arrayData.length,
        limit: limit,
        totalPages: Math.ceil(arrayData.length / limit),
        page: page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage: page > 1,
        hasNextPage: false,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: null,
      };
    }
    
    // Return empty paginated response
    return {
      docs: [],
      totalDocs: 0,
      limit: limit,
      totalPages: 1,
      page: page,
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
      limit: limit,
      totalPages: 1,
      page: page,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

/**
 * Get a single person/client by ID
 * Uses GET /api/client/{id} endpoint
 */
export async function getPerson(id: string): Promise<Person> {
  const response = await api.get<Person>(`/api/client/${id}`, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Create a new person/client
 * Uses POST /api/client endpoint
 * Note: This function is kept for backward compatibility but createClient() is preferred
 */
export async function createPerson(
  data: CreatePersonRequest
): Promise<Person> {
  const response = await api.post<Person>("/api/client", data, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Update an existing person/client
 * Uses PUT /api/client/{id} endpoint
 */
export async function updatePerson(
  data: UpdatePersonRequest
): Promise<Person> {
  const { id, ...updateData } = data;
  const response = await api.put<Person>(`/api/client/${id}`, updateData, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Delete a person/client
 * Uses DELETE /api/client/{id} endpoint
 */
export async function deletePerson(id: string): Promise<void> {
  await api.delete(`/api/client/${id}`, {
    includeAuth: true,
  });
}

/**
 * Create a new client using POST /api/client endpoint
 * This matches the Postman request format
 * Used in: http://localhost:3000/dashboard/people
 */
export async function createClient(
  data: CreateClientRequest
): Promise<any> {
  const response = await api.post<any>("/api/client", data, {
    includeAuth: true,
  });
  return response.data!;
}

