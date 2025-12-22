"use client";

import { FiX, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { type Lawyer } from "@/lib/services/lawyers";

interface ViewLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: Lawyer | null;
}

export default function ViewLawyerModal({
  isOpen,
  onClose,
  lawyer,
}: ViewLawyerModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!isOpen || !lawyer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl m-4 animate-scale-in ${isRTL ? "animate-slide-in-left" : "animate-slide-in-right"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 z-10">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)]">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              {t.lawyers.title} - {lawyer.firstName} {lawyer.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label={t.modals.close}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              {t.modals.basicInformation}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lawyer.title && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.titleLabel}</p>
                  <p className="text-sm text-slate-900">{lawyer.title}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-1">{t.lawyers.firstName}</p>
                <p className="text-sm text-slate-900">{lawyer.firstName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t.lawyers.lastName}</p>
                <p className="text-sm text-slate-900">{lawyer.lastName}</p>
              </div>
              {lawyer.fullName && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.fullName}</p>
                  <p className="text-sm text-slate-900">{lawyer.fullName}</p>
                </div>
              )}
              {lawyer.category && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.category}</p>
                  <p className="text-sm text-slate-900">{lawyer.category}</p>
                </div>
              )}
              {lawyer.subCategory && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.subCategory}</p>
                  <p className="text-sm text-slate-900">{lawyer.subCategory}</p>
                </div>
              )}
              {lawyer.jobTitle && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.jobTitle}</p>
                  <p className="text-sm text-slate-900">{lawyer.jobTitle}</p>
                </div>
              )}
              {lawyer.company && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t.lawyers.company}</p>
                  <p className="text-sm text-slate-900">{lawyer.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(lawyer.email || lawyer.phone || lawyer.mobile || lawyer.website || lawyer.fax) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
                {t.modals.contactInformation}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.email && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.email}</p>
                    <p className="text-sm text-slate-900">{lawyer.email}</p>
                  </div>
                )}
                {lawyer.phone && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.phone}</p>
                    <p className="text-sm text-slate-900">{lawyer.phone}</p>
                  </div>
                )}
                {lawyer.mobile && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.mobile}</p>
                    <p className="text-sm text-slate-900">{lawyer.mobile}</p>
                  </div>
                )}
                {lawyer.website && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.website}</p>
                    <p className="text-sm text-slate-900">{lawyer.website}</p>
                  </div>
                )}
                {lawyer.fax && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.fax}</p>
                    <p className="text-sm text-slate-900">{lawyer.fax}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {(lawyer.address1 || lawyer.address2 || lawyer.city || lawyer.country || lawyer.governorate || lawyer.postalCode) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
                {t.modals.location}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.address1 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.address1}</p>
                    <p className="text-sm text-slate-900">{lawyer.address1}</p>
                  </div>
                )}
                {lawyer.address2 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.address2}</p>
                    <p className="text-sm text-slate-900">{lawyer.address2}</p>
                  </div>
                )}
                {lawyer.city && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.city}</p>
                    <p className="text-sm text-slate-900">{lawyer.city}</p>
                  </div>
                )}
                {lawyer.country && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.country}</p>
                    <p className="text-sm text-slate-900">{lawyer.country}</p>
                  </div>
                )}
                {lawyer.governorate && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.governorate}</p>
                    <p className="text-sm text-slate-900">{lawyer.governorate}</p>
                  </div>
                )}
                {lawyer.postalCode && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.postalCode}</p>
                    <p className="text-sm text-slate-900">{lawyer.postalCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Information */}
          {(lawyer.fatherName || lawyer.motherName || lawyer.nationality || lawyer.dateOfBirth || lawyer.foreignFirstName || lawyer.foreignLastName) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
                {t.modals.personalInformation}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.fatherName && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.fatherName}</p>
                    <p className="text-sm text-slate-900">{lawyer.fatherName}</p>
                  </div>
                )}
                {lawyer.motherName && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.motherName}</p>
                    <p className="text-sm text-slate-900">{lawyer.motherName}</p>
                  </div>
                )}
                {lawyer.nationality && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.nationality}</p>
                    <p className="text-sm text-slate-900">{lawyer.nationality}</p>
                  </div>
                )}
                {lawyer.dateOfBirth && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.dateOfBirth}</p>
                    <p className="text-sm text-slate-900">{lawyer.dateOfBirth}</p>
                  </div>
                )}
                {lawyer.foreignFirstName && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.foreignFirstName}</p>
                    <p className="text-sm text-slate-900">{lawyer.foreignFirstName}</p>
                  </div>
                )}
                {lawyer.foreignLastName && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t.lawyers.foreignLastName}</p>
                    <p className="text-sm text-slate-900">{lawyer.foreignLastName}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={`flex justify-end pt-4 border-t border-slate-200 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t.modals.close}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

