"use client";

import { FiX, FiBriefcase, FiMail, FiGlobe, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { type Client } from "@/lib/services/clients";

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export default function ViewClientModal({
  isOpen,
  onClose,
  client,
}: ViewClientModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!isOpen || !client) return null;

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
              <FiBriefcase className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              {t.clients.title} - {client.companyName || client.shortName}
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
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.companyName}
                </label>
                <p className="text-sm text-slate-900">{client.companyName || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.shortName}
                </label>
                <p className="text-sm text-slate-900">{client.shortName || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.clientType}
                </label>
                <p className="text-sm text-slate-900">
                  {client.clientType === "company" ? t.clients.company : t.clients.person}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.subCategory}
                </label>
                <p className="text-sm text-slate-900">{client.subCategory || "-"}</p>
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
                  {t.clients.city}
                </label>
                <p className="text-sm text-slate-900">{client.city || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.country}
                </label>
                <p className="text-sm text-slate-900">{client.country || "-"}</p>
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
                  {t.clients.email}
                </label>
                <p className="text-sm text-slate-900 break-all">{client.email || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.mobile}
                </label>
                <p className="text-sm text-slate-900">{client.mobile || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.clients.phone}
                </label>
                <p className="text-sm text-slate-900">{client.phone || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <FiGlobe className="h-3 w-3" />
                  {t.clients.website}
                </label>
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--brand-strong)] hover:underline break-all"
                  >
                    {client.website}
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

