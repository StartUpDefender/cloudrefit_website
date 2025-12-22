"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly onPageChange: (page: number) => void;
  readonly onItemsPerPageChange?: (itemsPerPage: number) => void;
  readonly className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
}: PaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const getPageNumbers = () => {
    const pages: Array<{ type: "number" | "ellipsis"; value: number | string; key: string }> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: "number", value: i, key: `page-${i}` });
      }
    } else {
      // Always show first page
      pages.push({ type: "number", value: 1, key: "page-1" });

      if (currentPage > 3) {
        pages.push({ type: "ellipsis", value: "...", key: "ellipsis-start" });
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push({ type: "number", value: i, key: `page-${i}` });
      }

      if (currentPage < totalPages - 2) {
        pages.push({ type: "ellipsis", value: "...", key: "ellipsis-end" });
      }

      // Always show last page
      pages.push({ type: "number", value: totalPages, key: `page-${totalPages}` });
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50 ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Items info */}
      <div className={`text-sm text-slate-600 ${isRTL ? "text-right" : "text-left"}`}>
        <span>
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Pagination controls */}
      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        {/* Previous button - always shows left arrow (<) */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300"
          aria-label={isRTL ? "الصفحة السابقة" : "Previous page"}
        >
          <FiChevronLeft className="h-4 w-4 text-slate-500" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => {
            if (page.type === "ellipsis") {
              return (
                <span
                  key={page.key}
                  className="px-2 py-1 text-slate-400"
                >
                  {page.value}
                </span>
              );
            }

            const pageNum = page.value as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={page.key}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[2rem] h-8 px-3 rounded-lg border font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-b from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-white border-[var(--brand-strong)] shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button - always shows right arrow (>) */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300"
          aria-label={isRTL ? "الصفحة التالية" : "Next page"}
        >
          <FiChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <label className="text-sm text-slate-600">
            {isRTL ? "لكل صفحة:" : "Per page:"}
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-8 px-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all duration-200"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  );
}

