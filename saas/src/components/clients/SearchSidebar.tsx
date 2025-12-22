"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiRotateCcw } from "react-icons/fi";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface SearchField {
  id: string;
  label: string;
  accessor: string;
  type?: "text" | "select";
  options?: Array<{ value: string; label: string }>;
}

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  fields: SearchField[];
  onSearch: (filters: Record<string, { enabled: boolean; value: string; operator?: string }>) => void;
  initialFilters?: Record<string, { enabled: boolean; value: string; operator?: string }>;
}

export default function SearchSidebar({
  isOpen,
  onClose,
  fields,
  onSearch,
  initialFilters = {},
}: SearchSidebarProps) {
  const { language } = useLanguage();
  const t = useTranslation();
  const isRTL = language === "ar";

  const [filters, setFilters] = useState<Record<string, { enabled: boolean; value: string; operator?: string }>>(
    initialFilters
  );

  useEffect(() => {
    if (isOpen && Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleFieldToggle = (fieldId: string) => {
    setFilters((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        enabled: !prev[fieldId]?.enabled,
        value: prev[fieldId]?.value || "",
        operator: prev[fieldId]?.operator || "contains",
      },
    }));
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        value,
        enabled: prev[fieldId]?.enabled ?? true,
        operator: prev[fieldId]?.operator || "contains",
      },
    }));
  };

  const handleOperatorChange = (fieldId: string, operator: string) => {
    setFilters((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        operator,
        enabled: prev[fieldId]?.enabled ?? true,
        value: prev[fieldId]?.value || "",
      },
    }));
  };

  const handleReset = () => {
    const resetFilters: Record<string, { enabled: boolean; value: string; operator?: string }> = {};
    fields.forEach((field) => {
      resetFilters[field.id] = { enabled: false, value: "", operator: "contains" };
    });
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleApply = () => {
    onSearch(filters);
  };

  const operatorOptions = [
    { value: "contains", label: isRTL ? "يحتوي" : "Contains" },
    { value: "equals", label: isRTL ? "يساوي" : "Equals" },
    { value: "startsWith", label: isRTL ? "يبدأ بـ" : "Starts with" },
    { value: "endsWith", label: isRTL ? "ينتهي بـ" : "Ends with" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
        tabIndex={0}
        role="button"
        aria-label={t.modals.close}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right ${
          isRTL ? "left-0" : "right-0"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <FiSearch className="h-5 w-5 text-[var(--brand)]" />
            <h2 className="text-lg font-semibold text-slate-800 flex-1">
              {t.search.searchByFields || "Search by fields"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={t.modals.close}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 text-sm text-slate-600 hover:text-[var(--brand-strong)] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FiRotateCcw className="h-4 w-4" />
            <span>{t.search.resetFields || "Reset fields"}</span>
          </button>
        </div>

        {/* Search Fields */}
        <div className="p-4 space-y-4">
          {fields.map((field) => {
            const filter = filters[field.id] || { enabled: false, value: "", operator: "contains" };
            
            return (
              <div key={field.id} className="space-y-2">
                {/* Field Label with Checkbox */}
                <label
                  className={`flex items-center gap-0 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Checkbox
                    checked={filter.enabled}
                    onChange={() => handleFieldToggle(field.id)}
                    className="shrink-0"
                  />
                  <span className={`text-sm font-medium text-slate-700 whitespace-nowrap ${isRTL ? "mr-0" : "ml-0"}`}>{field.label}</span>
                </label>

                {/* Field Input */}
                {filter.enabled && (
                  <div className="space-y-2 pl-6">
                    {/* Operator Select */}
                    <Select
                      value={filter.operator || "contains"}
                      onChange={(e) => handleOperatorChange(field.id, e.target.value)}
                      options={operatorOptions}
                      className="text-sm"
                    />
                    
                    {/* Value Input */}
                    {field.type === "select" && field.options ? (
                      <Select
                        value={filter.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        options={field.options}
                        placeholder={t.search.selectValue || "Select value"}
                      />
                    ) : (
                      <Input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={t.search.enterValue || "Enter value"}
                        className="text-sm"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.modals.close}
            </Button>
            <Button
              variant="primary"
              onClick={handleApply}
              className="flex-1"
            >
              {t.search.apply || "Apply"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

