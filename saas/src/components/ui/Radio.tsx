import { InputHTMLAttributes, forwardRef } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          className={`h-4 w-4 border-slate-300 text-[var(--brand)] focus:ring-[var(--brand)]/20 focus:ring-offset-0 ${
            error ? "border-rose-300" : ""
          } ${className}`}
          {...props}
        />
        <label
          htmlFor={props.id}
          className={`ml-2 text-sm font-medium ${
            error ? "text-rose-600" : "text-slate-700"
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;




