"use client";

import { FiX, FiUser, FiMail, FiBriefcase, FiGlobe, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { type Person } from "@/lib/services/people";

interface ViewPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
}

export default function ViewPersonModal({
  isOpen,
  onClose,
  person,
}: ViewPersonModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!isOpen || !person) return null;

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
              {t.people.title} - {person.firstName} {person.lastName}
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
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
              {t.modals.personalInformation}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.firstName}
                </label>
                <p className="text-sm text-slate-900">{person.firstName || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.lastName}
                </label>
                <p className="text-sm text-slate-900">{person.lastName || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.fullName}
                </label>
                <p className="text-sm text-slate-900">{person.fullName || "-"}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiBriefcase className="h-4 w-4" />
              {t.modals.professionalInformation}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.jobTitle}
                </label>
                <p className="text-sm text-slate-900">{person.jobTitle || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.company}
                </label>
                <p className="text-sm text-slate-900">{person.company || "-"}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiMapPin className="h-4 w-4" />
              {t.modals.location}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.city}
                </label>
                <p className="text-sm text-slate-900">{person.city || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.country}
                </label>
                <p className="text-sm text-slate-900">{person.country || "-"}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiMail className="h-4 w-4" />
              {t.modals.contactInformation}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.email}
                </label>
                <p className="text-sm text-slate-900 break-all">{person.email || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.mobile}
                </label>
                <p className="text-sm text-slate-900">{person.mobile || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.people.phone}
                </label>
                <p className="text-sm text-slate-900">{person.phone || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <FiGlobe className="h-3 w-3" />
                  {t.people.website}
                </label>
                {person.website ? (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--brand-strong)] hover:underline break-all"
                  >
                    {person.website}
                  </a>
                ) : (
                  <p className="text-sm text-slate-900">-</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 flex items-center justify-end border-t border-slate-200 bg-white px-6 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button variant="outline" onClick={onClose}>
            {t.clients.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}

