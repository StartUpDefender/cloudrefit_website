/**
 * Lawyers API service
 * Handles all lawyer-related API calls
 */

import { api } from "../api";

export interface Lawyer {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  category?: string;
  subCategory?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  fax?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  governorate?: string;
  fatherName?: string;
  foreignFirstName?: string;
  foreignLastName?: string;
  motherName?: string;
  nationality?: string;
  dateOfBirth?: string;
  additionalIdentifiers?: string;
  document?: string;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
  additionalField4?: string;
  additionalField5?: string;
  additionalField6?: string;
  referredVia?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLawyerRequest {
  title?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  category?: string;
  subCategory?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  fax?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  governorate?: string;
  fatherName?: string;
  foreignFirstName?: string;
  foreignLastName?: string;
  motherName?: string;
  nationality?: string;
  dateOfBirth?: string;
  additionalIdentifiers?: string;
  document?: string;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
  additionalField4?: string;
  additionalField5?: string;
  additionalField6?: string;
  referredVia?: string;
}

export interface UpdateLawyerRequest extends Partial<CreateLawyerRequest> {
  id: string;
}

/**
 * Get all lawyers
 */
export async function getLawyers(): Promise<Lawyer[]> {
  try {
    const response = await api.get<Lawyer[]>("/api/lawyers", {
      includeAuth: true,
    });
    return response.data || [];
  } catch (error) {
    console.warn("API call failed, returning empty array for mock data fallback");
    return [];
  }
}

/**
 * Get a single lawyer by ID
 */
export async function getLawyer(id: string): Promise<Lawyer> {
  const response = await api.get<Lawyer>(`/api/lawyers/${id}`, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Create a new lawyer
 */
export async function createLawyer(
  data: CreateLawyerRequest
): Promise<Lawyer> {
  const response = await api.post<Lawyer>("/api/lawyers", data, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Update an existing lawyer
 */
export async function updateLawyer(
  data: UpdateLawyerRequest
): Promise<Lawyer> {
  const { id, ...updateData } = data;
  const response = await api.put<Lawyer>(`/api/lawyers/${id}`, updateData, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Delete a lawyer
 */
export async function deleteLawyer(id: string): Promise<void> {
  await api.delete(`/api/lawyers/${id}`, {
    includeAuth: true,
  });
}

