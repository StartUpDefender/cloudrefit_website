import { InputHTMLAttributes, forwardRef, useRef, useEffect } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className = "", ...props }, ref) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    return (
      <div className="w-full flex flex-col">
        <div className="flex items-start">
          <div className="relative flex items-center">
            <input
              ref={(node) => {
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                checkboxRef.current = node;
              }}
              type="checkbox"
              className={`peer h-4 w-4 cursor-pointer appearance-none rounded border-2 transition-all ${
                error
                  ? "border-rose-300"
                  : "border-slate-300 hover:border-[var(--brand)]"
              } checked:border-[var(--brand)] checked:bg-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:ring-offset-0 ${indeterminate ? "bg-[var(--brand)] border-[var(--brand)]" : ""} ${className}`}
              {...props}
            />
            {/* Checkmark icon */}
            <svg
              className="pointer-events-none absolute left-0 top-0 h-4 w-4 opacity-0 transition-opacity peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {/* Indeterminate icon */}
            {indeterminate && !props.checked && (
              <div className="pointer-events-none absolute left-0 top-0 flex h-4 w-4 items-center justify-center">
                <div className="h-0.5 w-2.5 rounded-full bg-white"></div>
              </div>
            )}
          </div>
          {label && (
            <label
              htmlFor={props.id}
              className={`ml-2 cursor-pointer text-sm font-medium transition-colors ${
                error
                  ? "text-rose-600"
                  : "text-slate-700 hover:text-[var(--brand-strong)]"
              }`}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1.5 ml-6 text-xs text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

