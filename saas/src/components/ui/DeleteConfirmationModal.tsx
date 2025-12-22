"use client";

import { FiX, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}: DeleteConfirmationModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!isOpen) return null;

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-lg shadow-xl m-4 animate-scale-in ${isRTL ? "animate-slide-in-left" : "animate-slide-in-right"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
              <FiAlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {title || t.modals.deleteConfirmation}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t.modals.close}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-slate-600">
            {message || (
              <>
                {t.modals.deleteMessage}{" "}
                <span className="font-semibold text-slate-900">
                  {itemName || t.modals.thisItem}
                </span>
                ? {t.modals.deleteWarning}
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            {t.clients.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/50"
          >
            {loading ? t.modals.deleting : t.table.delete}
          </Button>
        </div>
      </div>
    </div>
  );
}

