import { InputHTMLAttributes, forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", type, showPasswordToggle, ...props }, ref) => {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password" && showPasswordToggle;

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
          <input
            ref={ref}
            type={isPasswordField && showPassword ? "text" : type}
            className={`w-full rounded-lg border ${
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"
            } bg-white ${isPasswordField ? (isRTL ? "pl-10 pr-4" : "pr-10 pl-4") : "px-4"} py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:shadow-md ${className}`}
            {...props}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 ${isRTL ? "left-0 pl-3" : "right-0 pr-3"} flex items-center text-slate-400 hover:text-slate-600 transition-colors`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          )}
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

Input.displayName = "Input";

export default Input;


