/**
 * Form validation utilities
 * Centralized validation functions for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  if (!hasSymbol) {
    return {
      isValid: false,
      error: "Password must contain at least one symbol",
    };
  }

  return { isValid: true };
}

/**
 * Password match validation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
}

/**
 * Required field validation
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

/**
 * Phone number validation
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove spaces, dashes, and plus signs for validation
  const cleanedPhone = phone.replace(/[\s\-+]/g, "");

  // Check if it contains only digits and is at least 10 digits
  if (!/^\d{10,}$/.test(cleanedPhone)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  return { isValid: true };
}

/**
 * URL validation
 */
export function validateUrl(url: string, required: boolean = false): ValidationResult {
  if (!url) {
    if (required) {
      return { isValid: false, error: "URL is required" };
    }
    return { isValid: true }; // Optional field
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
}

/**
 * Register form validation
 */
export interface RegisterFormData {
  companyName: string;
  companyType: string;
  country: string;
  logo?: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  companyName?: string;
  companyType?: string;
  country?: string;
  logo?: string;
  userName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateRegisterForm(
  data: RegisterFormData
): { isValid: boolean; errors: RegisterFormErrors } {
  const errors: RegisterFormErrors = {};

  // Company Name
  const companyNameResult = validateRequired(data.companyName, "Company name");
  if (!companyNameResult.isValid) {
    errors.companyName = companyNameResult.error;
  }

  // Company Type
  const companyTypeResult = validateRequired(data.companyType, "Company type");
  if (!companyTypeResult.isValid) {
    errors.companyType = companyTypeResult.error;
  }

  // Country
  const countryResult = validateRequired(data.country, "Country");
  if (!countryResult.isValid) {
    errors.country = countryResult.error;
  }

  // Logo (optional)
  if (data.logo) {
    const logoResult = validateUrl(data.logo, false);
    if (!logoResult.isValid) {
      errors.logo = logoResult.error;
    }
  }

  // User Name
  const userNameResult = validateRequired(data.userName, "User name");
  if (!userNameResult.isValid) {
    errors.userName = userNameResult.error;
  }

  // Phone
  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error;
  }

  // Email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  // Password
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  // Confirm Password
  const confirmPasswordResult = validatePasswordMatch(
    data.password,
    data.confirmPassword
  );
  if (!confirmPasswordResult.isValid) {
    errors.confirmPassword = confirmPasswordResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Login form validation
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(
  data: LoginFormData
): { isValid: boolean; errors: LoginFormErrors } {
  const errors: LoginFormErrors = {};

  // Email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  // Password
  const passwordResult = validateRequired(data.password, "Password");
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Extract password validation error from API response
 */
export function extractPasswordError(errorMessage: string | null | undefined): string | null {
  if (!errorMessage) return null;

  const lowerMessage = errorMessage.toLowerCase();

  // Check if it's a password validation error
  if (
    lowerMessage.includes("password") &&
    (lowerMessage.includes("uppercase") ||
      lowerMessage.includes("lowercase") ||
      lowerMessage.includes("number") ||
      lowerMessage.includes("symbol") ||
      lowerMessage.includes("at least"))
  ) {
    return errorMessage;
  }

  return null;
}

/**
 * Person form validation
 */
export interface PersonFormData {
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

export interface PersonFormErrors {
  firstName?: string;
  lastName?: string;
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

export function validatePersonForm(
  data: PersonFormData
): { isValid: boolean; errors: PersonFormErrors } {
  const errors: PersonFormErrors = {};

  // First Name (required)
  const firstNameResult = validateRequired(data.firstName, "First name");
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error;
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Last Name (required)
  const lastNameResult = validateRequired(data.lastName, "Last name");
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error;
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  // Email (optional, but if provided must be valid)
  if (data.email && data.email.trim()) {
    const emailResult = validateEmail(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.error;
    }
  }

  // Website (optional, but if provided must be valid URL)
  if (data.website && data.website.trim()) {
    const websiteResult = validateUrl(data.website, false);
    if (!websiteResult.isValid) {
      errors.website = websiteResult.error;
    }
  }

  // Mobile (optional, but if provided must be valid phone)
  if (data.mobile && data.mobile.trim()) {
    const mobileResult = validatePhone(data.mobile);
    if (!mobileResult.isValid) {
      errors.mobile = mobileResult.error;
    }
  }

  // Phone (optional, but if provided must be valid phone)
  if (data.phone && data.phone.trim()) {
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.isValid) {
      errors.phone = phoneResult.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}


