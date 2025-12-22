import { SelectHTMLAttributes, forwardRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = "", ...props }, ref) => {
    const { language } = useLanguage();
    const isRTL = language === "ar";

    return (
      <div className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium mb-2 ${isRTL ? "text-right" : "text-left"} ${
              label.includes("*") && props.required && error
                ? "text-rose-600"
                : "text-slate-700"
            }`}
          >
            {label.includes("*") ? (
              <>
                {label.replace("*", "")}
                <span className="text-rose-600 ml-1">*</span>
              </>
            ) : (
              label
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full rounded-lg border ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"
            } bg-white ${isRTL ? "pl-10 pr-4" : "pr-10 pl-4"} py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 appearance-none cursor-pointer ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? "left-0 pl-3" : "right-0 pr-3"} flex items-center`}>
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className={`mt-1.5 text-xs text-rose-600 ${isRTL ? "text-right" : "text-left"}`}>{error}</p>
        )}
        {helperText && !error && (
          <p className={`mt-1.5 text-xs text-slate-500 ${isRTL ? "text-right" : "text-left"}`}>{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

