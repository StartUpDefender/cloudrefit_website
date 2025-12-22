/**
 * Clients API service
 * Handles all client-related API calls
 */

import { api } from "../api";

export interface Client {
  id: string;
  clientType: "company" | "person";
  companyName?: string;
  shortName?: string;
  subCategory?: string;
  city?: string;
  country?: string;
  website?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  clientType: "company" | "person";
  companyName?: string;
  shortName?: string;
  subCategory?: string;
  city?: string;
  country?: string;
  website?: string;
  mobile?: string;
  phone?: string;
  email?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  id: string;
}

/**
 * Get all clients
 */
export async function getClients(): Promise<Client[]> {
  const response = await api.get<Client[]>("/api/clients", {
    includeAuth: true,
  });
  return response.data || [];
}

/**
 * Get a single client by ID
 */
export async function getClient(id: string): Promise<Client> {
  const response = await api.get<Client>(`/api/clients/${id}`, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Create a new client
 */
export async function createClient(
  data: CreateClientRequest
): Promise<Client> {
  const response = await api.post<Client>("/api/clients", data, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Update an existing client
 */
export async function updateClient(
  data: UpdateClientRequest
): Promise<Client> {
  const { id, ...updateData } = data;
  const response = await api.put<Client>(`/api/clients/${id}`, updateData, {
    includeAuth: true,
  });
  return response.data!;
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/api/clients/${id}`, {
    includeAuth: true,
  });
}




