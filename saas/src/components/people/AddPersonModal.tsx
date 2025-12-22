"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { Button, Input, Select, Alert } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { updatePerson, createClient, type CreatePersonRequest, type CreateClientRequest, type Person } from "@/lib/services/people";
import { validatePersonForm } from "@/lib/validation";
import { getCountriesOptions } from "@/lib/data/countries";
import { getCompanies, type Company } from "@/lib/services/companies";
import { getCategories, type Category } from "@/lib/services/categories";
import { getSubcategories, type Subcategory } from "@/lib/services/subcategories";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  person?: Person | null;
  mode?: "add" | "edit";
}

export default function AddPersonModal({
  isOpen,
  onClose,
  onSuccess,
  person,
  mode = "add",
}: AddPersonModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Countries options for dropdown
  const countriesOptions = useMemo(() => [
    { value: "", label: t.people.none },
    ...getCountriesOptions(language),
  ], [language, t.people.none]);

  const [formData, setFormData] = useState<CreatePersonRequest>({
    firstName: person?.firstName || "",
    lastName: person?.lastName || "",
    fullName: person?.fullName || "",
    jobTitle: person?.jobTitle || "",
    company: person?.company || "",
    city: person?.city || "",
    country: person?.country || "",
    website: person?.website || "",
    phone: person?.phone || "",
    email: person?.email || "",
  });

  // Additional fields for createClient API
  const [clientFields, setClientFields] = useState({
    password: "",
    category: "",
    subcategory: "",
    emailURL: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePersonRequest, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Fetch companies, categories, and subcategories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchCategories();
      fetchSubcategories();
    }
  }, [isOpen]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      // Get all companies without pagination
      const response = await getCompanies();
      setCompanies(response.docs || []);
    } catch (err) {
      console.warn("Failed to fetch companies:", err);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      // Get all categories without pagination
      const response = await getCategories();
      setCategories(response.docs || []);
    } catch (err) {
      console.warn("Failed to fetch categories:", err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      // Get all subcategories without pagination
      const response = await getSubcategories();
      setSubcategories(response.docs || []);
    } catch (err) {
      console.warn("Failed to fetch subcategories:", err);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Companies options for dropdown
  const companiesOptions = useMemo(() => [
    { value: "", label: t.people.none },
    ...companies.map((company) => ({
      value: company.id || company._id || "",
      label: company.name || company.id || company._id || "",
    })),
  ], [companies, t.people.none]);

  // Categories options for dropdown
  const categoriesOptions = useMemo(() => [
    { value: "", label: t.people.none },
    ...categories.map((category) => ({
      value: category.id || category._id || "",
      label: category.name || category.id || category._id || "",
    })),
  ], [categories, t.people.none]);

  // Subcategories options for dropdown
  const subcategoriesOptions = useMemo(() => [
    { value: "", label: t.people.none },
    ...subcategories.map((subcategory) => ({
      value: subcategory.id || subcategory._id || "",
      label: subcategory.name || subcategory.id || subcategory._id || "",
    })),
  ], [subcategories, t.people.none]);

  // Update form data when person prop changes
  useEffect(() => {
    if (person && mode === "edit") {
      setFormData({
        firstName: person.firstName || "",
        lastName: person.lastName || "",
        fullName: person.fullName || "",
        jobTitle: person.jobTitle || "",
        company: person.company || "",
        city: person.city || "",
        country: person.country || "",
        website: person.website || "",
        phone: person.phone || "",
        email: person.email || "",
      });
    }
  }, [person, mode]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalStyle = globalThis.getComputedStyle(document.body).overflow;
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Cleanup: restore original overflow when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      fullName: "",
      jobTitle: "",
      company: "",
      city: "",
      country: "",
      website: "",
      phone: "",
      email: "",
    });
    setClientFields({
      password: "",
      category: "",
      subcategory: "",
      emailURL: "",
    });
    setErrors({});
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation using validation utility
    const validation = validatePersonForm(formData);
    
    if (!validation.isValid) {
      // Map validation errors to localized messages
      const localizedErrors: Partial<Record<keyof CreatePersonRequest, string>> = {};
      
      if (validation.errors.firstName) {
        localizedErrors.firstName = validation.errors.firstName.includes("required")
          ? t.people.required
          : validation.errors.firstName.includes("at least")
          ? t.people.minLength
          : validation.errors.firstName;
      }
      
      if (validation.errors.lastName) {
        localizedErrors.lastName = validation.errors.lastName.includes("required")
          ? t.people.required
          : validation.errors.lastName.includes("at least")
          ? t.people.minLength
          : validation.errors.lastName;
      }
      
      if (validation.errors.email) {
        localizedErrors.email = validation.errors.email.includes("valid")
          ? t.people.invalidEmail
          : validation.errors.email;
      }
      
      if (validation.errors.website) {
        localizedErrors.website = validation.errors.website.includes("valid")
          ? t.people.invalidUrl
          : validation.errors.website;
      }
      
      if (validation.errors.phone) {
        localizedErrors.phone = validation.errors.phone.includes("valid")
          ? t.people.invalidPhone
          : validation.errors.phone;
      }
      
      setErrors(localizedErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && person?.id) {
        await updatePerson({ id: person.id, ...formData });
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        // Use createClient API for new clients (POST /api/client)
        // Convert form data to CreateClientRequest format
        const userName = formData.fullName?.trim() || `${formData.firstName} ${formData.lastName}`.trim();
        const phone = formData.phone?.trim() || "";
        const email = formData.email?.trim() || "";
        const company = formData.company?.trim() || "";
        const category = clientFields.category?.trim() || "";
        
        const clientData: CreateClientRequest = {
          userName,
          phone,
          email,
          password: clientFields.password?.trim() || "Aa!123456", // Default password if not provided
          company,
          category,
          subcategory: clientFields.subcategory?.trim() || "",
          emailURL: clientFields.emailURL?.trim() || formData.website?.trim() || "",
          city: formData.city?.trim() || "",
          country: formData.country?.trim() || "",
        };

        // Validate required fields for client
        if (!clientData.userName.trim()) {
          setError("User name is required");
          setLoading(false);
          return;
        }
        if (!clientData.phone.trim()) {
          setError("Phone is required");
          setLoading(false);
          return;
        }
        if (!clientData.email.trim()) {
          setError("Email is required");
          setLoading(false);
          return;
        }
        if (!clientData.company.trim() && !clientData.category.trim()) {
          setError("Company or Category is required");
          setLoading(false);
          return;
        }

        await createClient(clientData);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || (mode === "edit" ? t.people.updateError : t.people.createError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        dir={isRTL ? "rtl" : "ltr"}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto bg-white shadow-2xl ${isRTL ? "left-0 animate-slide-in-left" : "right-0 animate-slide-in-right"} h-full`}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 z-10 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "edit" ? t.people.editPerson : t.people.addPerson}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label={t.modals.close}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <Alert variant="error" message={error} />
          )}
          {success && (
            <Alert variant="success" message={mode === "edit" ? t.people.updateSuccess : t.people.createSuccess} />
          )}

          {/* First Name */}
          <Input
            id="firstName"
            label={t.people.firstName}
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              // Clear error when user starts typing
              if (errors.firstName) {
                setErrors({ ...errors, firstName: undefined });
              }
            }}
            error={errors.firstName}
            required
          />

          {/* Last Name */}
          <Input
            id="lastName"
            label={t.people.lastName}
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              // Clear error when user starts typing
              if (errors.lastName) {
                setErrors({ ...errors, lastName: undefined });
              }
            }}
            error={errors.lastName}
            required
          />

          {/* Full Name */}
          <Input
            id="fullName"
            label={t.people.fullName}
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />

          {/* Job Title */}
          <Input
            id="jobTitle"
            label={t.people.jobTitle}
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
          />

          {/* Company */}
          <Select
            id="company"
            label={t.people.company}
            value={formData.company || ""}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            options={companiesOptions}
            disabled={loadingCompanies}
          />

          {/* City */}
          <Input
            id="city"
            label={t.people.city}
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
          />

          {/* Country */}
          <Select
            id="country"
            label={t.people.country}
            value={formData.country || ""}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            options={countriesOptions}
          />

          {/* Website */}
          <Input
            id="website"
            label={t.people.website}
            type="url"
            value={formData.website}
            onChange={(e) => {
              setFormData({ ...formData, website: e.target.value });
              // Clear error when user starts typing
              if (errors.website) {
                setErrors({ ...errors, website: undefined });
              }
            }}
            error={errors.website}
          />

          {/* Phone */}
          <Input
            id="phone"
            label={t.people.phone}
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              // Clear error when user starts typing
              if (errors.phone) {
                setErrors({ ...errors, phone: undefined });
              }
            }}
            error={errors.phone}
          />

          {/* Email */}
          <Input
            id="email"
            label={t.people.email}
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              // Clear error when user starts typing
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            error={errors.email}
            helperText={t.people.emailHelper}
            required
          />

          {/* Additional fields for Client API - only show when adding new */}
          {mode === "add" && (
            <>
              {/* Password */}
              <Input
                id="password"
                label={t.people.password}
                type="password"
                value={clientFields.password}
                onChange={(e) =>
                  setClientFields({ ...clientFields, password: e.target.value })
                }
                helperText={t.people.passwordHelper}
                showPasswordToggle={true}
              />

              {/* Category */}
              <Select
                id="category"
                label={t.people.category}
                value={clientFields.category || ""}
                onChange={(e) =>
                  setClientFields({ ...clientFields, category: e.target.value })
                }
                options={categoriesOptions}
                disabled={loadingCategories}
              />

              {/* Subcategory */}
              <Select
                id="subcategory"
                label={t.people.subcategory}
                value={clientFields.subcategory || ""}
                onChange={(e) =>
                  setClientFields({ ...clientFields, subcategory: e.target.value })
                }
                options={subcategoriesOptions}
                disabled={loadingSubcategories}
              />

              {/* Email URL */}
              <Input
                id="emailURL"
                label="Email URL"
                type="url"
                value={clientFields.emailURL}
                onChange={(e) =>
                  setClientFields({ ...clientFields, emailURL: e.target.value })
                }
                placeholder="https://example.com"
              />
            </>
          )}

          {/* Actions */}
          <div className={`flex gap-3 pt-4 border-t border-slate-200 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t.people.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? isRTL
                  ? mode === "edit"
                    ? "جاري التحديث..."
                    : "جاري الحفظ..."
                  : mode === "edit"
                  ? "Updating..."
                  : "Saving..."
                : mode === "edit"
                ? t.people.updateSuccess
                : t.people.save}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

