/**
 * Application configuration
 * Centralized configuration for API endpoints and base URLs
 */

export const config = {
  /**
   * Base URL for API requests
   * Can be overridden by NEXT_PUBLIC_API_BASE_URL environment variable
   */
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "",

  /**
   * Get full API URL for a given endpoint
   * @param endpoint - API endpoint path (e.g., "/api/users")
   * @returns Full URL string
   */
  getApiUrl: (endpoint: string): string => {
    const baseUrl = config.apiBaseUrl.replace(/\/$/, ""); // Remove trailing slash
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
  },
} as const;

/**
 * API Endpoints Reference
 * 
 * POST addClient: POST /api/client
 *   Full URL: ${config.apiBaseUrl}/api/client
 *   Implementation: src/lib/services/people.ts -> createClient()
 *   Component: src/components/people/AddPersonModal.tsx
 *   Page: http://localhost:3000/dashboard/people
 * 
 * GET getAllCompanies: GET /api/company
 *   Full URL: ${config.apiBaseUrl}/api/company
 *   Implementation: src/lib/services/companies.ts -> getCompanies()
 *   Component: src/components/people/AddPersonModal.tsx (dropdown)
 * 
 * GET getSingleCompany: GET /api/company/{id}
 *   Full URL: ${config.apiBaseUrl}/api/company/{id}
 *   Implementation: src/lib/services/companies.ts -> getCompany()
 * 
 * PUT updateCompany: PUT /api/company/{id}
 *   Full URL: ${config.apiBaseUrl}/api/company/{id}
 *   Implementation: src/lib/services/companies.ts -> updateCompany()
 * 
 * GET getAllCategories: GET /api/category
 *   Full URL: ${config.apiBaseUrl}/api/category
 *   Implementation: src/lib/services/categories.ts -> getCategories()
 *   Component: src/components/people/AddPersonModal.tsx (dropdown)
 * 
 * GET getSingleCategory: GET /api/category/{id}
 *   Full URL: ${config.apiBaseUrl}/api/category/{id}
 *   Implementation: src/lib/services/categories.ts -> getCategory()
 * 
 * POST createCategory: POST /api/category
 *   Full URL: ${config.apiBaseUrl}/api/category
 *   Implementation: src/lib/services/categories.ts -> createCategory()
 * 
 * PUT updateCategory: PUT /api/category/{id}
 *   Full URL: ${config.apiBaseUrl}/api/category/{id}
 *   Implementation: src/lib/services/categories.ts -> updateCategory()
 * 
 * POST addLawyer: POST /api/lawyers
 *   Full URL: ${config.apiBaseUrl}/api/lawyers
 *   Implementation: src/lib/services/lawyers.ts -> createLawyer()
 *   Component: src/components/lawyers/AddLawyerModal.tsx
 */

/**
 * Get the full URL for the POST addClient endpoint
 * @returns Full URL string for adding a client
 */
export const getAddClientUrl = (): string => {
  return config.getApiUrl("/api/client");
};

/**
 * Get the full URL for the GET companies endpoint
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Full URL string for getting companies
 */
export const getCompaniesUrl = (page: number = 1, limit: number = 10): string => {
  return config.getApiUrl(`/api/company?page=${page}&limit=${limit}`);
};

/**
 * Get the full URL for the POST addLawyer endpoint
 * @returns Full URL string for adding a lawyer
 */
export const getAddLawyerUrl = (): string => {
  return config.getApiUrl("/api/lawyers");
};

