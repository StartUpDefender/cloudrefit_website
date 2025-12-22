"use client";

import { useState, useEffect, FormEvent } from "react";
import { FiX, FiChevronDown, FiChevronUp, FiPlus, FiSearch, FiCalendar, FiFileText, FiMaximize2 } from "react-icons/fi";
import { Button, Input, Select } from "@/components/ui";
import { useTranslation } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
import { createLawyer, updateLawyer, type CreateLawyerRequest, type Lawyer } from "@/lib/services/lawyers";
import { Alert } from "@/components/ui";

interface AddLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lawyer?: Lawyer | null;
  mode?: "add" | "edit";
}

export default function AddLawyerModal({
  isOpen,
  onClose,
  onSuccess,
  lawyer,
  mode = "add",
}: AddLawyerModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState<CreateLawyerRequest>({
    title: lawyer?.title || "",
    firstName: lawyer?.firstName || "",
    lastName: lawyer?.lastName || "",
    fullName: lawyer?.fullName || "",
    category: lawyer?.category || "",
    subCategory: lawyer?.subCategory || "",
    jobTitle: lawyer?.jobTitle || "",
    company: lawyer?.company || "",
    email: lawyer?.email || "",
    phone: lawyer?.phone || "",
    mobile: lawyer?.mobile || "",
    website: lawyer?.website || "",
    fax: lawyer?.fax || "",
    address1: lawyer?.address1 || "",
    address2: lawyer?.address2 || "",
    postalCode: lawyer?.postalCode || "",
    city: lawyer?.city || "",
    country: lawyer?.country || "",
    governorate: lawyer?.governorate || "",
    fatherName: lawyer?.fatherName || "",
    foreignFirstName: lawyer?.foreignFirstName || "",
    foreignLastName: lawyer?.foreignLastName || "",
    motherName: lawyer?.motherName || "",
    nationality: lawyer?.nationality || "",
    dateOfBirth: lawyer?.dateOfBirth || "",
    additionalIdentifiers: lawyer?.additionalIdentifiers || "",
    document: lawyer?.document || "",
    additionalField1: lawyer?.additionalField1 || "",
    additionalField2: lawyer?.additionalField2 || "",
    additionalField3: lawyer?.additionalField3 || "",
    additionalField4: lawyer?.additionalField4 || "",
    additionalField5: lawyer?.additionalField5 || "",
    additionalField6: lawyer?.additionalField6 || "",
    referredVia: lawyer?.referredVia || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateLawyerRequest, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Collapsible sections state
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [additionalFieldsOpen, setAdditionalFieldsOpen] = useState(false);

  // Sub-category modal state
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [newSubCategory, setNewSubCategory] = useState("");

  // Update form data when lawyer prop changes
  useEffect(() => {
    if (lawyer && mode === "edit") {
      setFormData({
        title: lawyer.title || "",
        firstName: lawyer.firstName || "",
        lastName: lawyer.lastName || "",
        fullName: lawyer.fullName || "",
        category: lawyer.category || "",
        subCategory: lawyer.subCategory || "",
        jobTitle: lawyer.jobTitle || "",
        company: lawyer.company || "",
        email: lawyer.email || "",
        phone: lawyer.phone || "",
        mobile: lawyer.mobile || "",
        website: lawyer.website || "",
        fax: lawyer.fax || "",
        address1: lawyer.address1 || "",
        address2: lawyer.address2 || "",
        postalCode: lawyer.postalCode || "",
        city: lawyer.city || "",
        country: lawyer.country || "",
        governorate: lawyer.governorate || "",
        fatherName: lawyer.fatherName || "",
        foreignFirstName: lawyer.foreignFirstName || "",
        foreignLastName: lawyer.foreignLastName || "",
        motherName: lawyer.motherName || "",
        nationality: lawyer.nationality || "",
        dateOfBirth: lawyer.dateOfBirth || "",
        additionalIdentifiers: lawyer.additionalIdentifiers || "",
        document: lawyer.document || "",
        additionalField1: lawyer.additionalField1 || "",
        additionalField2: lawyer.additionalField2 || "",
        additionalField3: lawyer.additionalField3 || "",
        additionalField4: lawyer.additionalField4 || "",
        additionalField5: lawyer.additionalField5 || "",
        additionalField6: lawyer.additionalField6 || "",
        referredVia: lawyer.referredVia || "",
      });
    }
  }, [lawyer, mode]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    const newErrors: Partial<Record<keyof CreateLawyerRequest, string>> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t.lawyers.required;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.lawyers.required;
    }

    if (!formData.category || !formData.category.trim()) {
      newErrors.category = t.lawyers.required;
    }

    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.lawyers.invalidEmail;
    }

    if (formData.website && formData.website.trim() && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = t.lawyers.invalidUrl;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && lawyer?.id) {
        await updateLawyer({ id: lawyer.id, ...formData });
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        await createLawyer(formData);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || (mode === "edit" ? t.lawyers.updateError : t.lawyers.createError));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      firstName: "",
      lastName: "",
      fullName: "",
      category: "",
      subCategory: "",
      jobTitle: "",
      company: "",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      fax: "",
      address1: "",
      address2: "",
      postalCode: "",
      city: "",
      country: "",
      governorate: "",
      fatherName: "",
      foreignFirstName: "",
      foreignLastName: "",
      motherName: "",
      nationality: "",
    dateOfBirth: "",
    additionalIdentifiers: "",
    document: "",
    additionalField1: "",
    additionalField2: "",
    additionalField3: "",
    additionalField4: "",
    additionalField5: "",
    additionalField6: "",
    referredVia: "",
    });
    setErrors({});
    setError(null);
    setSuccess(false);
    setContactInfoOpen(false);
    setAddressOpen(false);
    setPersonalInfoOpen(false);
    setDocumentOpen(false);
    setAdditionalFieldsOpen(false);
    onClose();
  };

  // Add icon for contact information section
  const ContactIcon = () => (
    <svg className="h-4 w-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  // Add icon for address section
  const AddressIcon = () => (
    <svg className="h-4 w-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Add icon for personal information section
  const PersonalInfoIcon = () => (
    <svg className="h-4 w-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

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
            {mode === "edit" ? t.lawyers.editLawyer : t.lawyers.addLawyer}
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
            <Alert variant="success" message={mode === "edit" ? t.lawyers.updateSuccess : t.lawyers.createSuccess} />
          )}

          {/* Title */}
          <Select
            id="title"
            label={t.lawyers.titleLabel}
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            options={[
              { value: "", label: t.lawyers.none },
              { value: "Mr.", label: "Mr." },
              { value: "Ms.", label: "Ms." },
              { value: "Mrs.", label: "Mrs." },
              { value: "Dr.", label: "Dr." },
            ]}
          />

          {/* First Name */}
          <Input
            id="firstName"
            label={`${t.lawyers.firstName}*`}
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
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
            label={`${t.lawyers.lastName}*`}
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName) {
                setErrors({ ...errors, lastName: undefined });
              }
            }}
            error={errors.lastName}
            required
          />

          {/* Category */}
          <Select
            id="category"
            label={`${t.lawyers.category}*`}
            value={formData.category || ""}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              if (errors.category) {
                setErrors({ ...errors, category: undefined });
              }
            }}
            options={[
              { value: "", label: t.lawyers.chooseCategory },
              { value: "lawyer", label: "Lawyer" },
              { value: "company", label: "Company" },
              { value: "person", label: "Person" },
            ]}
            error={errors.category}
            required
          />

          {/* Sub-category */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                id="subCategory"
                label={t.lawyers.subCategory}
                value={formData.subCategory || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subCategory: e.target.value })
                }
                options={[
                  { value: "", label: t.lawyers.none },
                  ...subCategories.map((cat) => ({ value: cat, label: cat })),
                ]}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-8"
              onClick={() => setIsSubCategoryModalOpen(true)}
            >
              <FiPlus className="h-4 w-4 mr-1" />
              {t.lawyers.addSubCategory}
            </Button>
          </div>

          {/* Job Title */}
          <Input
            id="jobTitle"
            label={t.lawyers.jobTitle}
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
          />

          {/* Email */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="email"
                label={t.lawyers.email}
                type="email"
                placeholder={t.lawyers.startTyping}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                error={errors.email}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-8"
              onClick={() => {/* Handle add email */}}
            >
              <FiPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Phone */}
          <Input
            id="phone"
            label={t.lawyers.phone}
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Mobile */}
          <Input
            id="mobile"
            label={t.lawyers.mobile}
            type="tel"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
          />

 

          {/* Contact Information - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setContactInfoOpen(!contactInfoOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <ContactIcon />
                <span>{t.lawyers.contactInformation}</span>
              </div>
              {contactInfoOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            {contactInfoOpen && (
              <div className="px-4 pb-4 space-y-4">
                <Input
                  id="website"
                  label={t.lawyers.website}
                  type="url"
                  value={formData.website}
                  onChange={(e) => {
                    setFormData({ ...formData, website: e.target.value });
                    if (errors.website) {
                      setErrors({ ...errors, website: undefined });
                    }
                  }}
                  error={errors.website}
                />
                <Input
                  id="fax"
                  label={t.lawyers.fax}
                  type="tel"
                  value={formData.fax}
                  onChange={(e) =>
                    setFormData({ ...formData, fax: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Address - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setAddressOpen(!addressOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <AddressIcon />
                <span>{t.lawyers.address}</span>
              </div>
              {addressOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            {addressOpen && (
              <div className="px-4 pb-4 space-y-4">
                <Input
                  id="address1"
                  label={t.lawyers.address1}
                  value={formData.address1}
                  onChange={(e) =>
                    setFormData({ ...formData, address1: e.target.value })
                  }
                />
                <Input
                  id="address2"
                  label={t.lawyers.address2}
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData({ ...formData, address2: e.target.value })
                  }
                />
                <Input
                  id="postalCode"
                  label={t.lawyers.postalCode}
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                />
                <Input
                  id="city"
                  label={t.lawyers.city}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <Select
                  id="country"
                  label={t.lawyers.country}
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  options={[
                    { value: "", label: t.lawyers.none },
                  ]}
                />
                <Input
                  id="governorate"
                  label={t.lawyers.governorate}
                  value={formData.governorate}
                  onChange={(e) =>
                    setFormData({ ...formData, governorate: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Personal Information - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <PersonalInfoIcon />
                <span>{t.lawyers.personalInformation}</span>
              </div>
              {personalInfoOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            {personalInfoOpen && (
              <div className="px-4 pb-4 space-y-4">
                <Input
                  id="fatherName"
                  label={t.lawyers.fatherName}
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                />
                <Input
                  id="foreignFirstName"
                  label={t.lawyers.foreignFirstName}
                  value={formData.foreignFirstName}
                  onChange={(e) =>
                    setFormData({ ...formData, foreignFirstName: e.target.value })
                  }
                />
                <Input
                  id="foreignLastName"
                  label={t.lawyers.foreignLastName}
                  value={formData.foreignLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, foreignLastName: e.target.value })
                  }
                />
                <Input
                  id="motherName"
                  label={t.lawyers.motherName}
                  value={formData.motherName}
                  onChange={(e) =>
                    setFormData({ ...formData, motherName: e.target.value })
                  }
                />
                <div className="relative">
                  <Input
                    id="nationality"
                    label={t.lawyers.nationality}
                    placeholder={t.lawyers.startTypingToSelect}
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                  />
                  <FiSearch className={`absolute ${isRTL ? "left-3" : "right-3"} top-9 h-4 w-4 text-slate-400`} />
                </div>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    label={t.lawyers.dateOfBirth}
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                  <FiCalendar className={`absolute ${isRTL ? "left-3" : "right-3"} top-9 h-4 w-4 text-slate-400`} />
                </div>
                <Select
                  id="additionalIdentifiers"
                  label={t.lawyers.additionalIdentifiers}
                  value={formData.additionalIdentifiers || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalIdentifiers: e.target.value })
                  }
                  options={[
                    { value: "", label: t.lawyers.chooseOne },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Document - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setDocumentOpen(!documentOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <FiFileText className="h-4 w-4 text-[var(--brand)]" />
                <span>{t.lawyers.document}</span>
              </div>
              {documentOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            {documentOpen && (
              <div className="px-4 pb-4 space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <div className={`flex items-center justify-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <FiMaximize2 className="h-5 w-5 text-[var(--brand)]" />
                    <button
                      type="button"
                      className="text-sm text-[var(--brand)] hover:underline"
                    >
                      {t.lawyers.editAdditionalField}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.lawyers.startTypingToSelect}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Fields - Collapsible */}
          <div className="border border-slate-200 rounded-lg">
            <div className={`flex items-center justify-between px-4 py-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={() => setAdditionalFieldsOpen(!additionalFieldsOpen)}
                className={`flex-1 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-50 transition rounded ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span>{t.lawyers.additionalFields}</span>
                {additionalFieldsOpen ? (
                  <FiChevronUp className="h-5 w-5" />
                ) : (
                  <FiChevronDown className="h-5 w-5" />
                )}
              </button>
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => {/* Handle add additional field */}}
              >
                <FiPlus className="h-4 w-4" />
              </Button>
            </div>
            {additionalFieldsOpen && (
              <div className="px-4 pb-4 space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="button"
                      className="text-sm text-[var(--brand)] hover:underline flex items-center gap-2"
                    >
                      <FiMaximize2 className="h-4 w-4" />
                      {t.lawyers.editAdditionalField}
                    </button>
                  </div>
                  <Input
                    id="referredVia"
                    label={t.lawyers.referredVia}
                    value={formData.referredVia}
                    onChange={(e) =>
                      setFormData({ ...formData, referredVia: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField1"
                    label={`${t.lawyers.additionalFields} 2`}
                    value={formData.additionalField1}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField1: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField2"
                    label={`${t.lawyers.additionalFields} 3`}
                    value={formData.additionalField2}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField2: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField3"
                    label={`${t.lawyers.additionalFields} 4`}
                    value={formData.additionalField3}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField3: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField4"
                    label={`${t.lawyers.additionalFields} 5`}
                    value={formData.additionalField4}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField4: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField5"
                    label={`${t.lawyers.additionalFields} 6`}
                    value={formData.additionalField5}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField5: e.target.value })
                    }
                  />
                  <Input
                    id="additionalField6"
                    label={`${t.lawyers.additionalFields} 7`}
                    value={formData.additionalField6}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalField6: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

      

          {/* Actions */}
          <div className={`flex gap-3 pt-4 border-t border-slate-200 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t.lawyers.cancel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {/* Handle save and create another */}}
              className="flex-1"
            >
              {t.lawyers.saveAndCreateAnother}
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
                : t.lawyers.save}
            </Button>
          </div>
        </form>
      </div>

      {/* Sub-category Modal */}
      {isSubCategoryModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSubCategoryModalOpen(false)}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className={`relative w-full max-w-md bg-white rounded-lg shadow-xl m-4 animate-scale-in ${isRTL ? "animate-slide-in-left" : "animate-slide-in-right"}`}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {t.lawyers.addSubCategory}
              </h2>
              <button
                onClick={() => {
                  setIsSubCategoryModalOpen(false);
                  setNewSubCategory("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label={t.modals.close}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <Input
                id="newSubCategory"
                label={t.lawyers.subCategory}
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder={t.lawyers.startTyping}
                required
              />

              {/* Existing Sub-categories */}
              {subCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.lawyers.existingSubCategories || "Existing Sub-categories"}
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subCategories.map((cat) => (
                      <div
                        key={cat}
                        className={`flex items-center justify-between p-2 bg-slate-50 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-sm text-slate-700">{cat}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSubCategories(subCategories.filter((c) => c !== cat));
                            if (formData.subCategory === cat) {
                              setFormData({ ...formData, subCategory: "" });
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 transition"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`flex gap-3 pt-4 border-t border-slate-200 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSubCategoryModalOpen(false);
                    setNewSubCategory("");
                  }}
                  className="flex-1"
                >
                  {t.lawyers.cancel}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (newSubCategory.trim() && !subCategories.includes(newSubCategory.trim())) {
                      setSubCategories([...subCategories, newSubCategory.trim()]);
                      setFormData({ ...formData, subCategory: newSubCategory.trim() });
                      setNewSubCategory("");
                      setIsSubCategoryModalOpen(false);
                    }
                  }}
                  disabled={!newSubCategory.trim() || subCategories.includes(newSubCategory.trim())}
                  className="flex-1"
                >
                  {t.lawyers.save}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

